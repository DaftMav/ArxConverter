# ArxConverter

This userscript converts ARX prices to real currencies and updates the values on the Elite Dangerous DLC store automatically.

![ShopPage](https://github.com/user-attachments/assets/0d52ba19-7a21-474b-a7a1-345700a8594d)

It also shows what the discount-% for each Arx package is on the [Arx purchase page](https://www.elitedangerous.com/store/arx), along with several example "Arx = Cost" values to compare packages. Note for these overviews the bonus Arx points are all included.

![ArxPurchasePage](https://github.com/user-attachments/assets/ccdd296a-dbc4-4447-b0c0-7aeb363c72e9)

## Installation

This userscript can run in a userscript manager like [Violentmonkey](https://violentmonkey.github.io/), [Greasemonkey](https://www.greasespot.net/), or [Tampermonkey](https://www.tampermonkey.net/).
So in order for it to work, you have to install one of those Extensions.

Once you have a userscript manager installed, [clicking here](arx-converter-userscript.user.js?raw=1) should open a prompt asking you if you want to install the ArxConverter script. Click install and you should be good to go! :)

## How does it work?

By default prices for each item will be calculated to the lowest Arx package possible to buy that specific item. So if an item costs 12000 Arx
it will calculate the price using the cost of the 16800 Arx package. But if an item costs 4000 Arx it will use the cost of the 5000 Arx package.

You can however use the settings to make it always use the cost of one specific Arx package.

## Settings

There's a section at the top of the script where you can customize a few settings:

### Changing Currency
This script supports GBP, EUR and USD. To select on of them, edit the value of `useCurrency` to either 0, 1 or 2.

|GBP|EUR|USD|
|---|---|----
|0|1|2

Note this has no effect on the Arx purchase page as there is a currency selection on the website itself that you need to use.

### Using the cost of one specific Arx package
Instead of letting the script calculate prices based on what package would fit best you can also use the setting `usePackage` to always use the cost of one specific Arx package, so it will always use that price tier for everything.
This is useful if for example you've bought the 51000 package and want to see what all items will cost calculated with that package cost basis.

|Off|5000|8400|16800|25500|51000|85000
|---|---|---|---|---|---|---
|false|0|1|2|3|4|5

### A few other small settings
- `includeBonusArx` By default any bonus Arx that comes with most Arx packages is included for any calculations on items. Disabling this may cause it to use a more expensive package.
- `showArx` By default items will still show the original Arx prices, this can be changed to hide Arx prices entirely on items and only show the cost in your currency.
- `arxValues` This holds a set of preview values shown on each Arx package on the Arx purchase page. You can customize this to your liking but best to keep it limited to at most six values.
