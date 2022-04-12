"use strict";

var _dom = require("../utils/dom");

var _template_engine_registry = require("./template_engine_registry");

(0, _template_engine_registry.registerTemplateEngine)('jquery-tmpl', {
  compile: function compile(element) {
    return (0, _dom.extractTemplateMarkup)(element);
  },
  render: function render(template, data) {
    /* global jQuery */
    return jQuery.tmpl(template, data);
  }
});
(0, _template_engine_registry.registerTemplateEngine)('jsrender', {
  compile: function compile(element) {
    /* global jsrender */
    return (jQuery ? jQuery : jsrender).templates((0, _dom.extractTemplateMarkup)(element));
  },
  render: function render(template, data) {
    return template.render(data);
  }
});
(0, _template_engine_registry.registerTemplateEngine)('mustache', {
  compile: function compile(element) {
    /* global Mustache */
    return (0, _dom.extractTemplateMarkup)(element);
  },
  render: function render(template, data) {
    return Mustache.render(template, data);
  }
});
(0, _template_engine_registry.registerTemplateEngine)('hogan', {
  compile: function compile(element) {
    /* global Hogan */
    return Hogan.compile((0, _dom.extractTemplateMarkup)(element));
  },
  render: function render(template, data) {
    return template.render(data);
  }
});
(0, _template_engine_registry.registerTemplateEngine)('underscore', {
  compile: function compile(element) {
    /* global _ */
    return _.template((0, _dom.extractTemplateMarkup)(element));
  },
  render: function render(template, data) {
    return template(data);
  }
});
(0, _template_engine_registry.registerTemplateEngine)('handlebars', {
  compile: function compile(element) {
    /* global Handlebars */
    return Handlebars.compile((0, _dom.extractTemplateMarkup)(element));
  },
  render: function render(template, data) {
    return template(data);
  }
});
(0, _template_engine_registry.registerTemplateEngine)('doT', {
  compile: function compile(element) {
    /* global doT */
    return doT.template((0, _dom.extractTemplateMarkup)(element));
  },
  render: function render(template, data) {
    return template(data);
  }
});