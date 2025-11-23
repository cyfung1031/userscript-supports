/*!
 * sortByPCA.js - A userscript-compatible library for PCA-based sorting.
 *
 * Copyright (C) 2025  CY Fung
 *
 * This library is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <https://www.gnu.org/licenses/>.
 */

var sortByPCA = (data) => {
    const m = data.length;
    if (m === 0) return { indices: [], scores: [] };

    const n = data[0].length;
    if (n === 0) {
        return {
            indices: Array.from({ length: m }, (_, i) => i),
            scores: new Float64Array(m)
        };
    }

    const EPS = 1e-12;

    // 1. Mean with compensated (Kahan) summation for better numerical stability
    const mean = new Float64Array(n);
    for (let j = 0; j < n; j++) {
        let sum = 0;
        let c = 0; // compensation
        for (let i = 0; i < m; i++) {
            const y = data[i][j] - c;
            const t = sum + y;
            c = (t - sum) - y;
            sum = t;
        }
        mean[j] = sum / m;
    }

    // 2. Build centered data matrix X and measure total variance
    const X = new Float64Array(m * n);
    let idx = 0;
    let totalVar = 0;
    for (let i = 0; i < m; i++) {
        const row = data[i];
        for (let j = 0; j < n; j++) {
            const centered = row[j] - mean[j];
            X[idx++] = centered;
            totalVar += centered * centered;
        }
    }

    // 3. Check for effectively zero variance (within numerical tolerance)
    if (!Number.isFinite(totalVar) || totalVar <= EPS) {
        return {
            indices: Array.from({ length: m }, (_, i) => i),
            scores: new Float64Array(m)
        };
    }

    // Utility: covariance * v  (using X^T X / (m-1))
    const temp = new Float64Array(m);   // X v
    const covMatTimesVec = (v, out) => {
        // temp = X v
        for (let i = 0; i < m; i++) {
            let sum = 0;
            const base = i * n;
            for (let j = 0; j < n; j++) {
                sum += X[base + j] * v[j];
            }
            temp[i] = sum;
        }

        // out = X^T temp
        for (let j = 0; j < n; j++) out[j] = 0;
        for (let i = 0; i < m; i++) {
            const yi = temp[i];
            const base = i * n;
            for (let j = 0; j < n; j++) {
                out[j] += X[base + j] * yi;
            }
        }

        // Scale by (m-1) if possible
        const denom = m > 1 ? (m - 1) : 1;
        const scale = 1 / denom;
        for (let j = 0; j < n; j++) out[j] *= scale;
    };

    // 4. Initialize v using column variances (more stable than pure random)
    const v = new Float64Array(n);
    const w = new Float64Array(n);

    let hasNonZero = false;
    for (let j = 0; j < n; j++) {
        let colVar = 0;
        for (let i = 0; i < m; i++) {
            const val = X[i * n + j];
            colVar += val * val;
        }
        v[j] = colVar;
        if (colVar !== 0) hasNonZero = true;
    }

    if (!hasNonZero) {
        // Extremely degenerate but already handled by totalVar check; just guard anyway
        return {
            indices: Array.from({ length: m }, (_, i) => i),
            scores: new Float64Array(m)
        };
    }

    // Normalize v safely
    let norm = 0;
    for (let j = 0; j < n; j++) norm += v[j] * v[j];
    norm = Math.sqrt(norm);

    if (!Number.isFinite(norm) || norm < EPS) {
        return {
            indices: Array.from({ length: m }, (_, i) => i),
            scores: new Float64Array(m)
        };
    }
    for (let j = 0; j < n; j++) v[j] /= norm;

    // 5. Power iteration with angle-based convergence and robust guards
    const maxIter = 100;
    const tol = 1e-12;
    for (let iter = 0; iter < maxIter; iter++) {
        covMatTimesVec(v, w);

        // Norm of w
        let wNorm = 0;
        for (let j = 0; j < n; j++) wNorm += w[j] * w[j];
        wNorm = Math.sqrt(wNorm);

        if (!Number.isFinite(wNorm) || wNorm < EPS) {
            // Eigenvalue close to zero or numerical underflow
            break;
        }

        // Normalize w
        for (let j = 0; j < n; j++) w[j] /= wNorm;

        // Convergence via angle: 1 - |v·w| < tol
        let dot = 0;
        for (let j = 0; j < n; j++) dot += v[j] * w[j];

        // Clamp dot in [-1, 1] to avoid slight numerical overshoot
        if (dot > 1) dot = 1;
        else if (dot < -1) dot = -1;

        const angleMeasure = 1 - Math.abs(dot); // ~0 when aligned or opposite

        // Update v
        for (let j = 0; j < n; j++) v[j] = w[j];

        if (angleMeasure < tol) break;
    }

    const pc = v;

    // 6. Project all points onto the first PC and track min/max in one pass
    const scores = new Float64Array(m);

    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < m; i++) {
        const base = i * n;
        let s = 0;

        for (let j = 0; j < n; j++) {
            s += X[base + j] * pc[j];
        }

        scores[i] = s;
        if (s > max) max = s;
        if (s < min) min = s;
    }

    // 7. Ensure consistent orientation: flip if negative side dominates
    if (m > 0 && Math.abs(min) > Math.abs(max)) {
        for (let i = 0; i < m; i++) {
            scores[i] = -scores[i];
        }
    }

    // 8. Sort indices by descending score
    const indices = Array.from({ length: m }, (_, i) => i);
    indices.sort((a, b) => scores[b] - scores[a]);

    // Return plain JS array for scores, typed array stays internal
    return {
        indices,
        scores: Array.from(scores)
    };
}
