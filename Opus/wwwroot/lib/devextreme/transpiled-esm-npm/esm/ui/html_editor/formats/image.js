import Quill from 'devextreme-quill';
import { isObject } from '../../../core/utils/type';
var ExtImage = {};

if (Quill) {
  var Image = Quill.import('formats/image');
  ExtImage = class ExtImage extends Image {
    static create(data) {
      var SRC = data && data.src || data;
      var node = super.create(SRC);

      if (isObject(data)) {
        var setAttribute = (attr, value) => {
          data[attr] && node.setAttribute(attr, value);
        };

        setAttribute('alt', data.alt);
        setAttribute('width', data.width);
        setAttribute('height', data.height);
      }

      return node;
    }

    static formats(domNode) {
      var formats = super.formats(domNode);
      formats['imageSrc'] = domNode.getAttribute('src');
      return formats;
    }

    formats() {
      var formats = super.formats();
      var floatValue = this.domNode.style['float'];

      if (floatValue) {
        formats['float'] = floatValue;
      }

      return formats;
    }

    format(name, value) {
      if (name === 'float') {
        this.domNode.style[name] = value;
      } else {
        super.format(name, value);
      }
    }

    static value(domNode) {
      return {
        src: domNode.getAttribute('src'),
        width: domNode.getAttribute('width'),
        height: domNode.getAttribute('height'),
        alt: domNode.getAttribute('alt')
      };
    }

  };
  ExtImage.blotName = 'extendedImage';
}

export default ExtImage;