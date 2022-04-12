import Quill from 'devextreme-quill';
import { isObject } from '../../../core/utils/type';
var ExtLink = {};

if (Quill) {
  var Link = Quill.import('formats/link');
  ExtLink = class ExtLink extends Link {
    static create(data) {
      var HREF = data && data.href || data;
      var node = super.create(HREF);

      if (isObject(data)) {
        if (data.text) {
          node.innerText = data.text;
        }

        if (!data.target) {
          node.removeAttribute('target');
        }
      }

      return node;
    }

    static formats(domNode) {
      return {
        href: domNode.getAttribute('href'),
        target: domNode.getAttribute('target')
      };
    }

    formats() {
      var formats = super.formats();
      var {
        href,
        target
      } = ExtLink.formats(this.domNode);
      formats.link = href;
      formats.target = target;
      return formats;
    }

    format(name, value) {
      if (name === 'link' && isObject(value)) {
        if (value.text) {
          this.domNode.innerText = value.text;
        }

        if (value.target) {
          this.domNode.setAttribute('target', '_blank');
        } else {
          this.domNode.removeAttribute('target');
        }

        this.domNode.setAttribute('href', value.href);
      } else {
        super.format(name, value);
      }
    }

    static value(domNode) {
      return {
        href: domNode.getAttribute('href'),
        text: domNode.innerText,
        target: !!domNode.getAttribute('target')
      };
    }

  };
}

export default ExtLink;