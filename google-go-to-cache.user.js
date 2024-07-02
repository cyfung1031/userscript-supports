// ==UserScript==
// @name         Google Search Go To Cache
// @namespace    UserScript
// @version      0.2.0
// @description  Show a tooltip with Google Cache link for external links in Google search results
// @author       CY Fung
// @license      MIT
// @match        https://www.google.com/search*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const filterRule = '#search a[href]'
    const forceHTTPS = false;


    function isGoogleHost(hostname) {

        if (hostname === 'www.google.com') return true;
        if (hostname === 'google.com') return true;
        if (hostname.endsWith('.google.com')) return true;
        return false;
    }

    let tooltipTimeout;
    const tooltip = document.createElement('div');
    let tooltipInner = document.createElement('div');
    tooltipInner.className = 'cache-tooltip-inner'
    tooltip.className = 'cache-tooltip';
    tooltipInner.textContent = 'Cache page';
    tooltip.style.position = 'absolute';
    tooltipInner.style.backgroundColor = 'black';
    tooltipInner.style.color = 'white';
    tooltipInner.style.padding = '5px';
    tooltipInner.style.borderRadius = '5px';
    tooltip.style.zIndex = '1000';
    tooltip.style.cursor = 'pointer';
    tooltip.style.display = 'none';
    tooltipInner.style.display='inline-block'
    tooltip.appendChild(tooltipInner);

    tooltip.addEventListener('click', function() {
        window.location.href = tooltip.dataset.cacheLink;
    });

    document.body.appendChild(tooltip);

    document.addEventListener('mouseenter', function(event) {
        if (event.target.tagName === 'A' && event.target.href && event.target.matches(filterRule)) {
            const link = event.target.href;
            const url = new URL(link);
            if (!isGoogleHost(url.hostname)) {

                clearTimeout(tooltipTimeout);
                showTooltip(event.target);
            }
        }
    }, true);

    document.addEventListener('mouseleave', function(event) {
        if (event.target.tagName === 'A' && event.target.href) {
            hideTooltipWithDelay();
        }
    }, true);

    tooltip.addEventListener('mouseleave', function() {
        hideTooltipWithDelay();
    });

    tooltip.addEventListener('mouseenter', function() {
        clearTimeout(tooltipTimeout);
    });

let cssAdded = false;
    function showTooltip(element) {

        if(!cssAdded){
            cssAdded = true;
            document.head.appendChild(document.createElement('style')).textContent = `
            
            .cache-tooltip{
                opacity: 0.75;
                user-select: none;
                z-index: 999;
            }
            .cache-tooltip:hover {
                opacity: 1;
            }


            `
        }

        let link = element.href;
        if(forceHTTPS) link = link.replace(/^http\:\/\//, 'https://');
        const cacheLink = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(link)}`;

        tooltip.dataset.cacheLink = cacheLink;
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top + window.scrollY + rect.height}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.display = 'block';
        tooltip.style.width = `${rect.width}px`;
    }

    function hideTooltipWithDelay() {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 160); // Delay before hiding the tooltip
    }
})();
