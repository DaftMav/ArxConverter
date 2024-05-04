// ==UserScript==
// @name        ArxConverter
// @description Replaces the ARX price tags in the elite dangerous dlc store with real-world currency price tags
// @namespace   Violentmonkey Scripts
// @match       https://www.elitedangerous.com/store/*
// @grant       none
// @version     1.0
// @author      ShadowLp174
// @description 4.5.2024, 09:51:01
// ==/UserScript==

const discountMap = [
  [5000, 349],
  [8400, 599],
  [16800, 1149],
  [25500, 1599],
  [51000, 2999],
  [85000, 5499]
]
const currency = "€";


const convertArx = (arx) => {
  // NOTE: This conversion algorithm only works with currencies that are based on hundreds. For example: 100 cents = 1 euro

  arx = parseInt(arx.replaceAll(",", ""))

  // calculate highest discounted tier
  let idx = discountMap.findLastIndex(e => e[0] <= arx)
  let price = discountMap[idx][1];
  arx -= discountMap[idx][0];

  // calculate price of remaining arx
  price += (arx * (discountMap[0][1] / discountMap[0][0]))

  price = Math.round(price + Number.EPSILON) / 100; // Number.EPSILON to prevent floating-point errors while dividing

  // append a 0 if there is only 1 decimal for the looks
  price = "" + price;
  price = price.split(".")
  price[1] = (price[1].length < 2) ? price[1] + "0" : price[1]
  return price.join(".")
}

window.addEventListener("load", () => {
  var tags = document.body.getElementsByClassName("o-price")

  const priceElems = [];
  for (let i = 0; i < tags.length; i++) {
    priceElems.push(tags[i].children[0])
    const currencySymbol = document.createElement("span")
    currencySymbol.innerText = currency;
    currencySymbol.style = "margin-left: 4px";
    tags[i].children[1].remove();
    tags[i].appendChild(currencySymbol)
  }

  priceElems.map(e => e.innerText = convertArx(e.innerText))
});
