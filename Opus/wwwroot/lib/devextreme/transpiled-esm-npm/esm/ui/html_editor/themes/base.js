import Quill from 'devextreme-quill';
var BaseTheme;

if (Quill) {
  var Theme = Quill.import('core/theme');
  BaseTheme = class BaseTheme extends Theme {
    constructor(quill, options) {
      super(quill, options);
      this.quill.root.classList.add('dx-htmleditor-content');
      this.quill.root.setAttribute('role', 'textbox');
    }

  };
} else {
  BaseTheme = {};
}

export default BaseTheme;