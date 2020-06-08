// let x = '1872-1873,1882-1883,1890,1892-1893,1902-1903,1912-1913,1920,1922-1923,1930,1932-1933,1940,1942-1943,1950,1952-1953,1960,1962-1963,1970,1972-1973,1980,1982-1983,1990,1992-1993,2000,2002-2003,2010,2012-2013,2020,2022-2023,2200,2210,2220,2230,2240,2250,2260,2270,2280,2290,2300-2301,2310-2311,2320-2321,2330-2331,2340-2341,2350-2351,2360-2361,2370-2371,2380-2381,2390-2391,2400-2401,2410,2420,2430,2440,2450,2460,2470,2480-2481,2490,2500-2501,2510,2520,2550,3000-3020,3100'
// ​let firstSplit = x.split('-')
// ​let nums = firstSplit.map(a => a.split(',')).flat().map(n => Number(n))
// ​let missingNums = []
// ​
// for (let i = 0; i < nums.length; i++) {
//     if (i != nums.length && nums[i + 1] != nums[i] + 1) {
//         let times = nums[i + 1] - nums[i]
//         for (let j = 1; j < times; j ++) {
//             missingNums.push(nums[i] + j)
//         }
//     }
// }
// console.log(missingNums)


const islessthan4095 = (currentValue) => currentValue < 4095;
let x = '345,3000,2300,123,4096'
x = (x.split(','))
if (x.every(islessthan4095) === true)
{
    console.log("Vlans Pass Checked")
} else {
    console.log('Vlans is more than 4094')
}
