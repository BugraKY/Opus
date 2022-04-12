import { isMaterial, isCompact, current } from "../../../../ui/themes";
var defaultIconSizes = [[22, 16], [18, 16]];
var defaultFontSizes = [[[12, 8], [20, 18]], [[16, 10], [16, 14]]];

function getThemeType() {
  var theme = current();
  return {
    isMaterialTheme: isMaterial(theme),
    isCompactTheme: isCompact(theme)
  };
}

function getDefaultIconSize() {
  var {
    isCompactTheme,
    isMaterialTheme
  } = getThemeType();
  return defaultIconSizes[+isMaterialTheme][+isCompactTheme];
}

function getDefaultFontSize(isChecked) {
  var {
    isCompactTheme,
    isMaterialTheme
  } = getThemeType();
  return defaultFontSizes[+isChecked][+isMaterialTheme][+isCompactTheme];
}

function getFontSizeByIconSize(iconSize, isChecked) {
  var defaultFontSize = getDefaultFontSize(isChecked);
  var defaultIconSize = getDefaultIconSize();
  var fontToIconSizeRatio = defaultFontSize / defaultIconSize;
  return Math.ceil(fontToIconSizeRatio * iconSize);
}

export { getDefaultFontSize, getDefaultIconSize, getFontSizeByIconSize };