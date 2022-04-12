import Quill from 'devextreme-quill';
var SizeStyle = {};

if (Quill) {
  SizeStyle = Quill.import('attributors/style/size');
  SizeStyle.whitelist = null;
}

export default SizeStyle;