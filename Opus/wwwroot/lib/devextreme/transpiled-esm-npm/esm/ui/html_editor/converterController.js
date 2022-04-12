class ConverterController {
  constructor() {
    this._converters = {};
  }

  addConverter(name, converter) {
    this._converters[name] = converter;
  }

  getConverter(name) {
    return this._converters[name];
  }

}

var controller = new ConverterController();
export default controller;