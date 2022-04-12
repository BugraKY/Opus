import Quill from 'devextreme-quill';
var FontStyle = {};

if (Quill) {
  FontStyle = Quill.import('attributors/style/font');
  FontStyle.whitelist = null;
}

export default FontStyle;