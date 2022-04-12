export default ((currencySymbol, accountingFormat) => {
  if (!accountingFormat) {
    return;
  }

  var encodedCurrencySymbol = currencySymbol;

  if (typeof currencySymbol === 'string') {
    encodedCurrencySymbol = '';

    for (var i = 0; i < currencySymbol.length; i++) {
      if (currencySymbol[i] !== '$') {
        encodedCurrencySymbol += '\\';
      }

      encodedCurrencySymbol += currencySymbol[i];
    }
  }

  var encodeSymbols = {
    '.00': '{0}',
    '\'': '\\\'',
    '\\(': '\\(',
    '\\)': '\\)',
    ' ': '\\ ',
    '"': '&quot;',
    '\\¤': encodedCurrencySymbol
  };
  var result = accountingFormat.split(';');

  for (var _i = 0; _i < result.length; _i++) {
    for (var symbol in encodeSymbols) {
      if (Object.prototype.hasOwnProperty.call(encodeSymbols, symbol)) {
        result[_i] = result[_i].replace(new RegExp(symbol, 'g'), encodeSymbols[symbol]);
      }
    }
  }

  return result.length === 2 ? result[0] + '_);' + result[1] : result[0];
});