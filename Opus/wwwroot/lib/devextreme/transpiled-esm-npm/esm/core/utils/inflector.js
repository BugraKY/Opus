import { map } from './iterator';

var _normalize = function _normalize(text) {
  if (text === undefined || text === null) {
    return '';
  }

  return String(text);
};

var _upperCaseFirst = function _upperCaseFirst(text) {
  return _normalize(text).charAt(0).toUpperCase() + text.substr(1);
};

var _chop = function _chop(text) {
  return _normalize(text).replace(/([a-z\d])([A-Z])/g, '$1 $2').split(/[\s_-]+/);
};

export var dasherize = function dasherize(text) {
  return map(_chop(text), function (p) {
    return p.toLowerCase();
  }).join('-');
};
export var underscore = function underscore(text) {
  return dasherize(text).replace(/-/g, '_');
};
export var camelize = function camelize(text, upperFirst) {
  return map(_chop(text), function (p, i) {
    p = p.toLowerCase();

    if (upperFirst || i > 0) {
      p = _upperCaseFirst(p);
    }

    return p;
  }).join('');
};
export var humanize = function humanize(text) {
  return _upperCaseFirst(dasherize(text).replace(/-/g, ' '));
};
export var titleize = function titleize(text) {
  return map(_chop(text), function (p) {
    return _upperCaseFirst(p.toLowerCase());
  }).join(' ');
};
var DIGIT_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export var captionize = function captionize(name) {
  var captionList = [];
  var i;
  var char;
  var isPrevCharNewWord = false;
  var isNewWord = false;

  for (i = 0; i < name.length; i++) {
    char = name.charAt(i);
    isNewWord = char === char.toUpperCase() && char !== '-' && char !== ')' && char !== '/' || char in DIGIT_CHARS;

    if (char === '_' || char === '.') {
      char = ' ';
      isNewWord = true;
    } else if (i === 0) {
      char = char.toUpperCase();
      isNewWord = true;
    } else if (!isPrevCharNewWord && isNewWord) {
      if (captionList.length > 0) {
        captionList.push(' ');
      }
    }

    captionList.push(char);
    isPrevCharNewWord = isNewWord;
  }

  return captionList.join('');
};