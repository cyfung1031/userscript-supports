/* general library */
/* for record purpose */


const inPlaceArrayPush = (() => {

    /*
      const n = 110099
      let v1 = new Array(n).fill(0).map(e=>Math.random().toFixed(4));
      
      let v2 = new Array(n).fill(0).map(e=>Math.random().toFixed(4));
      
      
      // v2.push.apply(v2, v1)
      v2.push(...v1);
      
      console.log(v2.length)
    */



    // chatgpt: The safe number for the length of a list when using Array.prototype.apply with a large array 
    // to avoid a "RangeError: Maximum call stack size exceeded" error is generally around 100,000. 
    // However, this limit can vary depending on the JavaScript engine and the environment 
    // in which it is running (e.g., browser, Node.js).
    // For a more conservative and safer approach, it's recommended to use a lower limit, around 50,000 elements. 



    /*


      let n1 = 50000, n2 = 150000;

      function binarySearch(low, high, evaluate) {
          let result = -1; // Default result if no such n is found

          while (low <= high) {
              const mid = Math.floor((low + high) / 2);
              const value = evaluate(mid);

              if (value) {
                  result = mid; // Record the largest found n
                  low = mid + 1; // Continue to search in the upper half
              } else {
                  high = mid - 1; // Search in the lower half
              }
          }

          return result; // Return the largest n found
      }

      const evaluate = (n)=>{


          let v1 = new Array(n).fill(0).map(e=>Math.random().toFixed(4));
          
          let v2 = new Array(n).fill(0).map(e=>Math.random().toFixed(4));
          
          
          // v2.push.apply(v2, v1)
          try{
          v2.push(...v1);
          }catch(e){}
          
          return v2.length === 2*n;

      }
      let res = binarySearch(n1, n2, evaluate);
      console.log(res)

    */


    // MAX(n) = 110065 in Macbook M1 Pro Brave
    // MAX(n) = 110069 in Macbook M1 Pro Chrome
    // MAX(n) = 65536 in Macbook M1 Pro Orion
    // MAX(n) = 65536 in Macbook M1 Pro Webkit
    // MAX(n) = 150000 in Macbook M1 Pro Firefox
    // MAX(n) = 110221 in Macbook M1 Pro min
    // MAX(n) = 110057 in Macbook M1 Pro Edge
    // MAX(n) = 150000 in Macbook M1 Pro Waterfox Classic

    // 50000 / 65536 = 76.3% > 20% buffer OK

    /*
    return function (dest, source) {
      const LIMIT_N = 50000;
      let len;
      while ((len = source.length) > 0) {
        if (len > LIMIT_N) {
          dest.push(...source.slice(0, LIMIT_N));
          source = source.slice(LIMIT_N);
        } else {
          dest.push(...source);
          break;
        }
      }
    }
*/

    /*

    function optimizedPush(dest, source) {
    const LIMIT_N = 50000;
    let start = 0;
    const len = source.length;

    while (start < len) {
        const end = Math.min(start + LIMIT_N, len);
        dest.push.apply(dest, source.slice(start, end));
        start = end;
    }
}

*/

    return function (dest, source) {
      const LIMIT_N = 50000;
      let index = 0;
      const len = source.length;
      while (index < len) {
        let chunkSize = len - index; // chunkSize > 0
        if (chunkSize > LIMIT_N) {
          chunkSize = LIMIT_N;
          dest.push(...source.slice(index, index + chunkSize));
        } else if (index > 0) { // to the end
          dest.push(...source.slice(index));
        } else { // normal push.apply
          dest.push(...source);
        }
        index += chunkSize;
      }
    }


  })();