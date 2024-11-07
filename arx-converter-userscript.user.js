// ==UserScript==
// @name        ArxConverter
// @description Replaces the ARX price tags in the elite dangerous dlc store with real-world currency price tags (4.5.2024, 09:51:01)
// @namespace   https://github.com/ShadowLp174/ArxConverter/
// @match       https://www.elitedangerous.com/store/*
// @grant       none
// @version     1.3
// @author      ShadowLp174
// @license     GNU AGPL
// @attribution DaftMav (https://github.com/DaftMav/ArxConverter/)
// ==/UserScript==

// ==================================
// Customization options:
// ==================================
/*
PRE-SET CURRENCIES:
0: GBP
1: EUR
2: USD
  Change the number below according to your desired currency
*/
const useCurrency = 0;

/*
By default the prices will be calculated to the lowest arx package possible to buy each seperate item, so if an item costs 12000 arx
it will use the cost of the 16800 arx package. But if an item costs 4000 arx it will use the cost of the 5000 arx package.

However you can choose to always use the cost of one specific arx package, so it will always use that price tier for everything.
This is useful if for example you've bought the 51000 package and want to see what items costs calculated from that arx:cost ratio.
0: 5000
1: 8400
2: 16800
3: 25500
4: 51000
5: 85000
false: will turn this off
Change the value of usePackage below to a specific arx package
*/
const usePackage = false; // false to turn off, or 0 to 5 for one of the arx packages as listed above

// A few other settings:
const includeBonusArx = true; // Calculations include bonus arx that comes with most arx packages
const showArx = true; // Set to false to hide Arx prices entirely on items
const arxValues = [5000, 6000, 8400, 16520, 25500, 33000]; // Preview values shown on each arx package on the arx purchase page

// ==================================
// Don't change anything below this
// ==================================
const bonusArx = [ 0, 420, 900, 1300, 3000, 15000 ]; // bonus arx values for each Arx package tier (probably won't change)

const gbpMap = [
  [5000, 299],
  [8400, 499],
  [16800, 959],
  [25500, 1299],
  [51000, 2499],
  [85000, 4499]
];
const eurMap = [
  [5000, 349],
  [8400, 599],
  [16800, 1149],
  [25500, 1599],
  [51000, 2999],
  [85000, 5499]
];
const usdMap = [
  [5000, 399],
  [8400, 699],
  [16800, 1299],
  [25500, 1899],
  [51000, 3799],
  [85000, 5999]
];
const discountMaps = [
  gbpMap,
  eurMap,
  usdMap
]
const currencies = ["£", "€", "$"]
const discountMap = discountMaps[useCurrency];
const currency = currencies[useCurrency];

const makeNumeric = (str) => {
    return parseInt(str.replace(/\D/g,'')); //trim non-numeric
}

const convertArx = (arx) => {
  // NOTE: This conversion algorithm only works with currencies that are based on hundreds. For example: 100 cents = 1 euro

  // account for sales: (theoretically obsolete now, but I'll keep it in just to be safe)
  arx = arx.split(" ")
  arx = arx[arx.length - 1] // select last element to display correct price if a sale is displayed
  arx = parseInt(arx.replaceAll(",", ""))

  if (arx === 0) return "0.00";

  let idx;
  if (usePackage !== false && (Number.isInteger(usePackage))) {
    // use chosen arx package tier
    idx = usePackage;
  } else {
    // find first package that exceeds cost of item
    idx = discountMap.findIndex((e) => e[0] >= arx)
    if (idx === -1) {
      idx = 0; // use lowest tier if the item's arx cost is less than the lowest arx package
    }
  }

  let packageArx = discountMap[idx][0];
  if (includeBonusArx) {
    packageArx += bonusArx[idx];
  }

  // calculate price of item within the larger arx package
  let price = (((arx * (discountMap[idx][1] / packageArx)) / 100) + Number.EPSILON).toFixed(2);

  return price;
}

const DOMready = fn => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

DOMready(function(){
  var tags = document.body.getElementsByClassName("o-price")

  for (let i = 0; i < tags.length; i++) {
    // Prevent layout overflow issue with too long price tags and on tiny store item blocks
    tags[i].style.cssText = "max-width: 100%; text-wrap: nowrap; font-size: 2rem;";

    let arx = tags[i].children[0].innerText;
    arx = arx.split(" ")

    if (!showArx) {
      tags[i].children[0].remove(); // remove arx price
      tags[i].children[0].remove(); // remove arx symbol
    }

    // in case this is an item on sale, the original and the discounted price are computed and displayed
    arx.forEach((a, j) => {
      const price = (j === 0 && arx.length > 1) ? document.createElement("s") : document.createElement("span")
      if (j === 0 && arx.length > 1) price.style = "text-decoration: line-through; opacity: .4; color: #000";

      price.innerText = convertArx(a)
      tags[i].appendChild(price);

      if (j !== 0) {
        price.style.marginLeft = "3px"; // the gap a space would do
      }else{
        if (showArx) price.style.marginLeft = "10px";
      }
    });

    const currencySymbol = document.createElement("span")
    currencySymbol.innerText = currency;
    currencySymbol.style = "margin-left: 4px";
    tags[i].appendChild(currencySymbol)
  }

  // Arx packages page
  // We need the currency used by the store here since cost varies in different currencies
  var pageCurrency = document.body.querySelector(".c-arx-currency-switcher__wrapper a.selected");
  if (pageCurrency !== null) pageCurrency = pageCurrency.innerText.trim();

  var basearx = 0;
  var basecost = 0;
  var arxcards = document.body.querySelectorAll("label.c-products-arx__item");
  for (let i=0; i<arxcards.length; i++) {
    var top = arxcards[i].querySelector("div.c-products-arx__item-image div");
    top.style.cssText = "padding-top: 32rem;";

    var arx = makeNumeric(arxcards[i].querySelector("div.c-products-arx__item-info h2").innerText.trim());
    let arxbonus;
    try {
      arxbonus = makeNumeric(arxcards[i].querySelector("div.c-products-arx__item-info span.bonus").innerText.trim());
    } catch (error) {
      arxbonus = 0; // no bonus arx found, default to 0
    }
    let arxtotal = arx + arxbonus;
    let cost = parseFloat(arxcards[i].querySelector("span.product-price").innerText.replace(/[^0-9.,]/g, ''));

    // store first package values for %-discount comparison on higher packages
    if (i == 0) {
      basearx = arxtotal;
      basecost = cost;
    }

    // Adding calculated arx preview values on top of each Arx card
    var details = `<div class="c-products-arx__item-price" style="position: absolute; top: 0; width: 100%; padding-bottom: 4rem;
    background-color: transparent; background-image: linear-gradient(to bottom, rgb(180, 149, 109), transparent);">`;
    // On packages with bonus arx
    if (arxbonus > 0) {
      let discountcost = (((basearx * (cost / arxtotal)) * 100) / 100); // what 5000 arx would be worth with this package
      let discountpct = (((basecost - discountcost) / basecost) * 100).toFixed(1); // %-decrease from base package
      details += '<span class="product-price" style="font-size: 2.2rem; font-variant-numeric: tabular-nums;">Discount '
        + discountpct + ' %</span><span style="padding: 0 0 4px 0; font-size: 1.6rem; ">(Incl. bonus arx)</span>';
    }else{
      details += '<span class="product-price" style="font-size: 2.2rem;">Base Package</span>';
    }
    details += `<span class="product-price" style="font-size: 1.9rem; font-variant-numeric: tabular-nums; text-wrap: nowrap;"><dl style="margin: 0;">`;

    // Calculate price for each arx preview value
    for (let i=0; i<arxValues.length; i++) {
      let previewprice = (((arxValues[i] * (cost / arxtotal)) * 100) / 100).toFixed(2);
      details += '<dt style="text-align: right;">' + arxValues[i] + ' Arx</dt><dd style="text-align: left; padding-left: 4px;">= '
        + pageCurrency + previewprice + '</dd>';
    }
    details += '</dl></span></div>';
    top.innerHTML = details;
  }
});