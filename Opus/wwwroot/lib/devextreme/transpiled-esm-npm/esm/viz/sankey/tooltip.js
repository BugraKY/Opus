import { extend as _extend } from '../../core/utils/extend';
import { isFunction } from '../../core/utils/type';

var defaultCustomizeLinkTooltip = function defaultCustomizeLinkTooltip(info) {
  return {
    html: "<strong>".concat(info.source, " > ").concat(info.target, "</strong><br/>Weight: ").concat(info.weight)
  };
};

var defaultCustomizeNodeTooltip = function defaultCustomizeNodeTooltip(info) {
  return {
    html: "<strong>".concat(info.label, "</strong><br/>Incoming weight: ").concat(info.weightIn, "<br/>Outgoing weight: ").concat(info.weightOut)
  };
};

var generateCustomCallback = function generateCustomCallback(customCallback, defaultCallback) {
  return function (objectInfo) {
    var res = isFunction(customCallback) ? customCallback.call(objectInfo, objectInfo) : {};
    var hasOwnProperty = Object.prototype.hasOwnProperty.bind(res);

    if (!hasOwnProperty('html') && !hasOwnProperty('text')) {
      res = _extend(res, defaultCallback.call(objectInfo, objectInfo));
    }

    return res;
  };
};

export function setTooltipCustomOptions(sankey) {
  sankey.prototype._setTooltipOptions = function () {
    var tooltip = this._tooltip;

    var options = tooltip && this._getOption('tooltip');

    var linkTemplate;
    var nodeTemplate;

    if (options.linkTooltipTemplate) {
      linkTemplate = this._getTemplate(options.linkTooltipTemplate);
    }

    if (options.nodeTooltipTemplate) {
      nodeTemplate = this._getTemplate(options.nodeTooltipTemplate);
    }

    tooltip && tooltip.update(_extend({}, options, {
      customizeTooltip: function customizeTooltip(args) {
        if (!(linkTemplate && args.type === 'link' || nodeTemplate && args.type === 'node')) {
          args.skipTemplate = true;
        }

        if (args.type === 'node') {
          return generateCustomCallback(options.customizeNodeTooltip, defaultCustomizeNodeTooltip)(args.info);
        } else if (args.type === 'link') {
          return generateCustomCallback(options.customizeLinkTooltip, defaultCustomizeLinkTooltip)(args.info);
        }

        return {};
      },

      contentTemplate(arg, div) {
        var templateArgs = {
          model: arg.info,
          container: div
        };

        if (linkTemplate && arg.type === 'link') {
          return linkTemplate.render(templateArgs);
        }

        if (nodeTemplate && arg.type === 'node') {
          return nodeTemplate.render(templateArgs);
        }
      },

      enabled: options.enabled
    }));
  };

  sankey.prototype.hideTooltip = function () {
    this._tooltip && this._tooltip.hide();
  };
}