"use strict";

exports.default = void 0;

var _size = require("../core/utils/size");

var _renderer = _interopRequireDefault(require("../core/renderer"));

var _guid = _interopRequireDefault(require("../core/guid"));

var _window = require("../core/utils/window");

var _events_engine = _interopRequireDefault(require("../events/core/events_engine"));

var _component_registrator = _interopRequireDefault(require("../core/component_registrator"));

var _callbacks = _interopRequireDefault(require("../core/utils/callbacks"));

var _type = require("../core/utils/type");

var _iterator = require("../core/utils/iterator");

var _extend = require("../core/utils/extend");

var _array = require("../core/utils/array");

var _deferred = require("../core/utils/deferred");

var _ajax = _interopRequireDefault(require("../core/utils/ajax"));

var _editor = _interopRequireDefault(require("./editor/editor"));

var _button = _interopRequireDefault(require("./button"));

var _progress_bar = _interopRequireDefault(require("./progress_bar"));

var _devices = _interopRequireDefault(require("../core/devices"));

var _index = require("../events/utils/index");

var _click = require("../events/click");

var _message = _interopRequireDefault(require("../localization/message"));

var _themes = require("./themes");

var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// STYLE fileUploader
var window = (0, _window.getWindow)();
var FILEUPLOADER_CLASS = 'dx-fileuploader';
var FILEUPLOADER_EMPTY_CLASS = 'dx-fileuploader-empty';
var FILEUPLOADER_SHOW_FILE_LIST_CLASS = 'dx-fileuploader-show-file-list';
var FILEUPLOADER_DRAGOVER_CLASS = 'dx-fileuploader-dragover';
var FILEUPLOADER_WRAPPER_CLASS = 'dx-fileuploader-wrapper';
var FILEUPLOADER_CONTAINER_CLASS = 'dx-fileuploader-container';
var FILEUPLOADER_CONTENT_CLASS = 'dx-fileuploader-content';
var FILEUPLOADER_INPUT_WRAPPER_CLASS = 'dx-fileuploader-input-wrapper';
var FILEUPLOADER_INPUT_CONTAINER_CLASS = 'dx-fileuploader-input-container';
var FILEUPLOADER_INPUT_LABEL_CLASS = 'dx-fileuploader-input-label';
var FILEUPLOADER_INPUT_CLASS = 'dx-fileuploader-input';
var FILEUPLOADER_FILES_CONTAINER_CLASS = 'dx-fileuploader-files-container';
var FILEUPLOADER_FILE_CONTAINER_CLASS = 'dx-fileuploader-file-container';
var FILEUPLOADER_FILE_INFO_CLASS = 'dx-fileuploader-file-info';
var FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS = 'dx-fileuploader-file-status-message';
var FILEUPLOADER_FILE_CLASS = 'dx-fileuploader-file';
var FILEUPLOADER_FILE_NAME_CLASS = 'dx-fileuploader-file-name';
var FILEUPLOADER_FILE_SIZE_CLASS = 'dx-fileuploader-file-size';
var FILEUPLOADER_BUTTON_CLASS = 'dx-fileuploader-button';
var FILEUPLOADER_BUTTON_CONTAINER_CLASS = 'dx-fileuploader-button-container';
var FILEUPLOADER_CANCEL_BUTTON_CLASS = 'dx-fileuploader-cancel-button';
var FILEUPLOADER_UPLOAD_BUTTON_CLASS = 'dx-fileuploader-upload-button';
var FILEUPLOADER_INVALID_CLASS = 'dx-fileuploader-invalid';
var FILEUPLOADER_AFTER_LOAD_DELAY = 400;
var FILEUPLOADER_CHUNK_META_DATA_NAME = 'chunkMetadata';

var renderFileUploaderInput = function renderFileUploaderInput() {
  return (0, _renderer.default)('<input>').attr('type', 'file');
};

var isFormDataSupported = function isFormDataSupported() {
  return !!window.FormData;
};

var FileUploader = /*#__PURE__*/function (_Editor) {
  _inheritsLoose(FileUploader, _Editor);

  function FileUploader() {
    return _Editor.apply(this, arguments) || this;
  }

  var _proto = FileUploader.prototype;

  _proto._supportedKeys = function _supportedKeys() {
    var _this = this;

    var click = function click(e) {
      e.preventDefault();

      var $selectButton = _this._selectButton.$element();

      _events_engine.default.trigger($selectButton, _click.name);
    };

    return (0, _extend.extend)(_Editor.prototype._supportedKeys.call(this), {
      space: click,
      enter: click
    });
  };

  _proto._setOptionsByReference = function _setOptionsByReference() {
    _Editor.prototype._setOptionsByReference.call(this);

    (0, _extend.extend)(this._optionsByReference, {
      value: true
    });
  };

  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Editor.prototype._getDefaultOptions.call(this), {
      chunkSize: 0,
      value: [],
      selectButtonText: _message.default.format('dxFileUploader-selectFile'),
      uploadButtonText: _message.default.format('dxFileUploader-upload'),
      labelText: _message.default.format('dxFileUploader-dropFile'),
      name: 'files[]',
      multiple: false,
      accept: '',
      uploadUrl: '/',
      allowCanceling: true,
      showFileList: true,
      progress: 0,
      dialogTrigger: undefined,
      dropZone: undefined,
      readyToUploadMessage: _message.default.format('dxFileUploader-readyToUpload'),
      uploadedMessage: _message.default.format('dxFileUploader-uploaded'),
      uploadFailedMessage: _message.default.format('dxFileUploader-uploadFailedMessage'),
      uploadAbortedMessage: _message.default.format('dxFileUploader-uploadAbortedMessage'),
      uploadMode: 'instantly',
      uploadMethod: 'POST',
      uploadHeaders: {},
      uploadCustomData: {},
      onBeforeSend: null,
      onUploadStarted: null,
      onUploaded: null,
      onFilesUploaded: null,
      onProgress: null,
      onUploadError: null,
      onUploadAborted: null,
      onDropZoneEnter: null,
      onDropZoneLeave: null,
      allowedFileExtensions: [],
      maxFileSize: 0,
      minFileSize: 0,
      inputAttr: {},
      invalidFileExtensionMessage: _message.default.format('dxFileUploader-invalidFileExtension'),
      invalidMaxFileSizeMessage: _message.default.format('dxFileUploader-invalidMaxFileSize'),
      invalidMinFileSizeMessage: _message.default.format('dxFileUploader-invalidMinFileSize'),

      /**
      * @name dxFileUploaderOptions.extendSelection
      * @type boolean
      * @default true
      * @hidden
      */
      extendSelection: true,

      /**
      * @name dxFileUploaderOptions.validationMessageMode
      * @hidden
      */
      validationMessageMode: 'always',
      uploadFile: null,
      uploadChunk: null,
      abortUpload: null,
      validationMessageOffset: {
        h: 0,
        v: 0
      },
      hoverStateEnabled: true,
      useNativeInputClick: false,
      useDragOver: true,
      nativeDropSupported: true,
      _uploadButtonType: 'normal'
    });
  };

  _proto._defaultOptionsRules = function _defaultOptionsRules() {
    return _Editor.prototype._defaultOptionsRules.call(this).concat([{
      device: function device() {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device: [{
        platform: 'android'
      }],
      options: {
        validationMessageOffset: {
          v: 0
        }
      }
    }, {
      device: function device() {
        return _devices.default.real().deviceType !== 'desktop';
      },
      options: {
        useDragOver: false
      }
    }, {
      device: function device() {
        return !isFormDataSupported();
      },
      options: {
        uploadMode: 'useForm'
      }
    }, {
      device: function device() {
        return _devices.default.real().deviceType !== 'desktop';
      },
      options: {
        nativeDropSupported: false
      }
    }, {
      device: function device() {
        return (0, _themes.isMaterial)();
      },
      options: {
        _uploadButtonType: 'default'
      }
    }]);
  };

  _proto._initOptions = function _initOptions(options) {
    var isLabelTextDefined = ('labelText' in options);

    _Editor.prototype._initOptions.call(this, options);

    if (!isLabelTextDefined && !this._shouldDragOverBeRendered()) {
      this.option('labelText', '');
    }
  };

  _proto._init = function _init() {
    _Editor.prototype._init.call(this);

    this._initFileInput();

    this._initLabel();

    this._setUploadStrategy();

    this._createFiles();

    this._createBeforeSendAction();

    this._createUploadStartedAction();

    this._createUploadedAction();

    this._createFilesUploadedAction();

    this._createProgressAction();

    this._createUploadErrorAction();

    this._createUploadAbortedAction();

    this._createDropZoneEnterAction();

    this._createDropZoneLeaveAction();
  };

  _proto._setUploadStrategy = function _setUploadStrategy() {
    var strategy = null;

    if (this.option('chunkSize') > 0) {
      var uploadChunk = this.option('uploadChunk');
      strategy = uploadChunk && (0, _type.isFunction)(uploadChunk) ? new CustomChunksFileUploadStrategy(this) : new DefaultChunksFileUploadStrategy(this);
    } else {
      var uploadFile = this.option('uploadFile');
      strategy = uploadFile && (0, _type.isFunction)(uploadFile) ? new CustomWholeFileUploadStrategy(this) : new DefaultWholeFileUploadStrategy(this);
    }

    this._uploadStrategy = strategy;
  };

  _proto._initFileInput = function _initFileInput() {
    var _this2 = this;

    this._isCustomClickEvent = false;

    if (!this._$fileInput) {
      this._$fileInput = renderFileUploaderInput();

      _events_engine.default.on(this._$fileInput, 'change', this._inputChangeHandler.bind(this));

      _events_engine.default.on(this._$fileInput, 'click', function (e) {
        e.stopPropagation();

        _this2._resetInputValue();

        return _this2.option('useNativeInputClick') || _this2._isCustomClickEvent;
      });
    }

    this._$fileInput.prop({
      multiple: this.option('multiple'),
      accept: this.option('accept'),
      tabIndex: -1
    });
  };

  _proto._inputChangeHandler = function _inputChangeHandler() {
    if (this._doPreventInputChange) {
      return;
    }

    var fileName = this._$fileInput.val().replace(/^.*\\/, '');

    var files = this._$fileInput.prop('files');

    if (files && !files.length && this.option('uploadMode') !== 'useForm') {
      return;
    }

    var value = files ? this._getFiles(files) : [{
      name: fileName
    }];

    this._changeValue(value);

    if (this.option('uploadMode') === 'instantly') {
      this._uploadFiles();
    }
  };

  _proto._shouldFileListBeExtended = function _shouldFileListBeExtended() {
    return this.option('uploadMode') !== 'useForm' && this.option('extendSelection') && this.option('multiple');
  };

  _proto._changeValue = function _changeValue(value) {
    var files = this._shouldFileListBeExtended() ? this.option('value').slice() : [];
    this.option('value', files.concat(value));
  };

  _proto._getFiles = function _getFiles(fileList) {
    var values = [];
    (0, _iterator.each)(fileList, function (_, value) {
      return values.push(value);
    });
    return values;
  };

  _proto._getFile = function _getFile(fileData) {
    var targetFileValue = (0, _type.isNumeric)(fileData) ? this.option('value')[fileData] : fileData;
    return this._files.filter(function (file) {
      return file.value === targetFileValue;
    })[0];
  };

  _proto._initLabel = function _initLabel() {
    if (!this._$inputLabel) {
      this._$inputLabel = (0, _renderer.default)('<div>');
    }

    this._updateInputLabelText();
  };

  _proto._updateInputLabelText = function _updateInputLabelText() {
    var correctedValue = this._isInteractionDisabled() ? '' : this.option('labelText');

    this._$inputLabel.text(correctedValue);
  };

  _proto._focusTarget = function _focusTarget() {
    return this.$element().find('.' + FILEUPLOADER_BUTTON_CLASS);
  };

  _proto._getSubmitElement = function _getSubmitElement() {
    return this._$fileInput;
  };

  _proto._initMarkup = function _initMarkup() {
    _Editor.prototype._initMarkup.call(this);

    this.$element().addClass(FILEUPLOADER_CLASS);

    this._renderWrapper();

    this._renderInputWrapper();

    this._renderSelectButton();

    this._renderInputContainer();

    this._renderUploadButton();

    this._preventRecreatingFiles = true;
    this._activeDropZone = null;
  };

  _proto._render = function _render() {
    this._preventRecreatingFiles = false;

    this._attachDragEventHandlers(this._$inputWrapper);

    this._attachDragEventHandlers(this.option('dropZone'));

    this._renderFiles();

    _Editor.prototype._render.call(this);
  };

  _proto._createFileProgressBar = function _createFileProgressBar(file) {
    file.progressBar = this._createProgressBar(file.value.size);
    file.progressBar.$element().appendTo(file.$file);

    this._initStatusMessage(file);

    this._ensureCancelButtonInitialized(file);
  };

  _proto._setStatusMessage = function _setStatusMessage(file, message) {
    var _this3 = this;

    setTimeout(function () {
      if (_this3.option('showFileList')) {
        if (file.$statusMessage) {
          file.$statusMessage.text(message);
          file.$statusMessage.css('display', '');
          file.progressBar.$element().remove();
        }
      }
    }, FILEUPLOADER_AFTER_LOAD_DELAY);
  };

  _proto._getUploadAbortedStatusMessage = function _getUploadAbortedStatusMessage() {
    return this.option('uploadMode') === 'instantly' ? this.option('uploadAbortedMessage') : this.option('readyToUploadMessage');
  };

  _proto._createFiles = function _createFiles() {
    var _this4 = this;

    var value = this.option('value');

    if (this._files && (value.length === 0 || !this._shouldFileListBeExtended())) {
      this._preventFilesUploading(this._files);

      this._files = null;
    }

    if (!this._files) {
      this._files = [];
    }

    (0, _iterator.each)(value.slice(this._files.length), function (_, value) {
      var file = _this4._createFile(value);

      _this4._validateFile(file);

      _this4._files.push(file);
    });
  };

  _proto._preventFilesUploading = function _preventFilesUploading(files) {
    var _this5 = this;

    files.forEach(function (file) {
      return _this5._uploadStrategy.abortUpload(file);
    });
  };

  _proto._validateFile = function _validateFile(file) {
    file.isValidFileExtension = this._validateFileExtension(file);
    file.isValidMinSize = this._validateMinFileSize(file);
    file.isValidMaxSize = this._validateMaxFileSize(file);
  };

  _proto._validateFileExtension = function _validateFileExtension(file) {
    var allowedExtensions = this.option('allowedFileExtensions');
    var accept = this.option('accept');

    var allowedTypes = this._getAllowedFileTypes(accept);

    var fileExtension = file.value.name.substring(file.value.name.lastIndexOf('.')).toLowerCase();

    if (accept.length !== 0 && !this._isFileTypeAllowed(file.value, allowedTypes)) {
      return false;
    }

    if (allowedExtensions.length === 0) {
      return true;
    }

    for (var i = 0; i < allowedExtensions.length; i++) {
      if (fileExtension === allowedExtensions[i].toLowerCase()) {
        return true;
      }
    }

    return false;
  };

  _proto._validateMaxFileSize = function _validateMaxFileSize(file) {
    var fileSize = file.value.size;
    var maxFileSize = this.option('maxFileSize');
    return maxFileSize > 0 ? fileSize <= maxFileSize : true;
  };

  _proto._validateMinFileSize = function _validateMinFileSize(file) {
    var fileSize = file.value.size;
    var minFileSize = this.option('minFileSize');
    return minFileSize > 0 ? fileSize >= minFileSize : true;
  };

  _proto._createBeforeSendAction = function _createBeforeSendAction() {
    this._beforeSendAction = this._createActionByOption('onBeforeSend', {
      excludeValidators: ['readOnly']
    });
  };

  _proto._createUploadStartedAction = function _createUploadStartedAction() {
    this._uploadStartedAction = this._createActionByOption('onUploadStarted', {
      excludeValidators: ['readOnly']
    });
  };

  _proto._createUploadedAction = function _createUploadedAction() {
    this._uploadedAction = this._createActionByOption('onUploaded', {
      excludeValidators: ['readOnly']
    });
  };

  _proto._createFilesUploadedAction = function _createFilesUploadedAction() {
    this._filesUploadedAction = this._createActionByOption('onFilesUploaded', {
      excludeValidators: ['readOnly']
    });
  };

  _proto._createProgressAction = function _createProgressAction() {
    this._progressAction = this._createActionByOption('onProgress', {
      excludeValidators: ['readOnly']
    });
  };

  _proto._createUploadAbortedAction = function _createUploadAbortedAction() {
    this._uploadAbortedAction = this._createActionByOption('onUploadAborted', {
      excludeValidators: ['readOnly']
    });
  };

  _proto._createUploadErrorAction = function _createUploadErrorAction() {
    this._uploadErrorAction = this._createActionByOption('onUploadError', {
      excludeValidators: ['readOnly']
    });
  };

  _proto._createDropZoneEnterAction = function _createDropZoneEnterAction() {
    this._dropZoneEnterAction = this._createActionByOption('onDropZoneEnter');
  };

  _proto._createDropZoneLeaveAction = function _createDropZoneLeaveAction() {
    this._dropZoneLeaveAction = this._createActionByOption('onDropZoneLeave');
  };

  _proto._createFile = function _createFile(value) {
    return {
      value: value,
      loadedSize: 0,
      onProgress: (0, _callbacks.default)(),
      onAbort: (0, _callbacks.default)(),
      onLoad: (0, _callbacks.default)(),
      onError: (0, _callbacks.default)(),
      onLoadStart: (0, _callbacks.default)(),
      isValidFileExtension: true,
      isValidMaxSize: true,
      isValidMinSize: true,
      isValid: function isValid() {
        return this.isValidFileExtension && this.isValidMaxSize && this.isValidMinSize;
      },
      isInitialized: false
    };
  };

  _proto._resetFileState = function _resetFileState(file) {
    file.isAborted = false;
    file.uploadStarted = false;
    file.isStartLoad = false;
    file.loadedSize = 0;
    file.chunksData = undefined;
    file.request = undefined;
  };

  _proto._renderFiles = function _renderFiles() {
    var _this6 = this,
        _this$_validationMess;

    var value = this.option('value');

    if (!this._$filesContainer) {
      this._$filesContainer = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_FILES_CONTAINER_CLASS).appendTo(this._$content);
    } else if (!this._shouldFileListBeExtended() || value.length === 0) {
      this._$filesContainer.empty();
    }

    var showFileList = this.option('showFileList');

    if (showFileList) {
      (0, _iterator.each)(this._files, function (_, file) {
        if (!file.$file) {
          _this6._renderFile(file);
        }
      });
    }

    this.$element().toggleClass(FILEUPLOADER_SHOW_FILE_LIST_CLASS, showFileList);

    this._toggleFileUploaderEmptyClassName();

    this._updateFileNameMaxWidth();

    (_this$_validationMess = this._validationMessage) === null || _this$_validationMess === void 0 ? void 0 : _this$_validationMess.repaint();
  };

  _proto._renderFile = function _renderFile(file) {
    var value = file.value;
    var $fileContainer = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_FILE_CONTAINER_CLASS).appendTo(this._$filesContainer);

    this._renderFileButtons(file, $fileContainer);

    file.$file = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_FILE_CLASS).appendTo($fileContainer);
    var $fileInfo = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_FILE_INFO_CLASS).appendTo(file.$file);
    file.$statusMessage = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_FILE_STATUS_MESSAGE_CLASS).appendTo(file.$file);
    (0, _renderer.default)('<div>').addClass(FILEUPLOADER_FILE_NAME_CLASS).text(value.name).appendTo($fileInfo);

    if ((0, _type.isDefined)(value.size)) {
      (0, _renderer.default)('<div>').addClass(FILEUPLOADER_FILE_SIZE_CLASS).text(this._getFileSize(value.size)).appendTo($fileInfo);
    }

    if (file.isValid()) {
      file.$statusMessage.text(this.option('readyToUploadMessage'));
    } else {
      if (!file.isValidFileExtension) {
        file.$statusMessage.append(this._createValidationElement('invalidFileExtensionMessage'));
      }

      if (!file.isValidMaxSize) {
        file.$statusMessage.append(this._createValidationElement('invalidMaxFileSizeMessage'));
      }

      if (!file.isValidMinSize) {
        file.$statusMessage.append(this._createValidationElement('invalidMinFileSizeMessage'));
      }

      $fileContainer.addClass(FILEUPLOADER_INVALID_CLASS);
    }
  };

  _proto._createValidationElement = function _createValidationElement(key) {
    return (0, _renderer.default)('<span>').text(this.option(key));
  };

  _proto._updateFileNameMaxWidth = function _updateFileNameMaxWidth() {
    var cancelButtonsCount = this.option('allowCanceling') && this.option('uploadMode') !== 'useForm' ? 1 : 0;
    var uploadButtonsCount = this.option('uploadMode') === 'useButtons' ? 1 : 0;
    var filesContainerWidth = (0, _size.getWidth)(this._$filesContainer.find('.' + FILEUPLOADER_FILE_CONTAINER_CLASS).first()) || (0, _size.getWidth)(this._$filesContainer);

    var $buttonContainer = this._$filesContainer.find('.' + FILEUPLOADER_BUTTON_CONTAINER_CLASS).eq(0);

    var buttonsWidth = (0, _size.getWidth)($buttonContainer) * (cancelButtonsCount + uploadButtonsCount);

    var $fileSize = this._$filesContainer.find('.' + FILEUPLOADER_FILE_SIZE_CLASS).eq(0);

    var prevFileSize = $fileSize.text();
    $fileSize.text('1000 Mb');
    var fileSizeWidth = (0, _size.getWidth)($fileSize);
    $fileSize.text(prevFileSize);

    this._$filesContainer.find('.' + FILEUPLOADER_FILE_NAME_CLASS).css('maxWidth', filesContainerWidth - buttonsWidth - fileSizeWidth);
  };

  _proto._renderFileButtons = function _renderFileButtons(file, $container) {
    var $cancelButton = this._getCancelButton(file);

    $cancelButton && $container.append($cancelButton);

    var $uploadButton = this._getUploadButton(file);

    $uploadButton && $container.append($uploadButton);
  };

  _proto._getCancelButton = function _getCancelButton(file) {
    var _this7 = this;

    if (this.option('uploadMode') === 'useForm') {
      return null;
    }

    file.cancelButton = this._createComponent((0, _renderer.default)('<div>').addClass(FILEUPLOADER_BUTTON_CLASS + ' ' + FILEUPLOADER_CANCEL_BUTTON_CLASS), _button.default, {
      onClick: function onClick() {
        return _this7._removeFile(file);
      },
      icon: 'close',
      visible: this.option('allowCanceling'),
      disabled: this.option('readOnly'),
      integrationOptions: {},
      hoverStateEnabled: this.option('hoverStateEnabled')
    });
    return (0, _renderer.default)('<div>').addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS).append(file.cancelButton.$element());
  };

  _proto._getUploadButton = function _getUploadButton(file) {
    var _this8 = this;

    if (!file.isValid() || this.option('uploadMode') !== 'useButtons') {
      return null;
    }

    file.uploadButton = this._createComponent((0, _renderer.default)('<div>').addClass(FILEUPLOADER_BUTTON_CLASS + ' ' + FILEUPLOADER_UPLOAD_BUTTON_CLASS), _button.default, {
      onClick: function onClick() {
        return _this8._uploadFile(file);
      },
      icon: 'upload',
      hoverStateEnabled: this.option('hoverStateEnabled')
    });
    file.onLoadStart.add(function () {
      return file.uploadButton.option({
        visible: false,
        disabled: true
      });
    });
    file.onAbort.add(function () {
      return file.uploadButton.option({
        visible: true,
        disabled: false
      });
    });
    return (0, _renderer.default)('<div>').addClass(FILEUPLOADER_BUTTON_CONTAINER_CLASS).append(file.uploadButton.$element());
  };

  _proto._removeFile = function _removeFile(file) {
    var _file$$file;

    (_file$$file = file.$file) === null || _file$$file === void 0 ? void 0 : _file$$file.parent().remove();

    this._files.splice((0, _array.inArray)(file, this._files), 1);

    var value = this.option('value').slice();
    value.splice((0, _array.inArray)(file.value, value), 1);
    this._preventRecreatingFiles = true;
    this.option('value', value);
    this._preventRecreatingFiles = false;

    this._toggleFileUploaderEmptyClassName();

    this._resetInputValue(true);
  };

  _proto.removeFile = function removeFile(fileData) {
    if (this.option('uploadMode') === 'useForm' || !(0, _type.isDefined)(fileData)) {
      return;
    }

    var file = this._getFile(fileData);

    if (file) {
      if (file.uploadStarted) {
        this._preventFilesUploading([file]);
      }

      this._removeFile(file);
    }
  };

  _proto._toggleFileUploaderEmptyClassName = function _toggleFileUploaderEmptyClassName() {
    this.$element().toggleClass(FILEUPLOADER_EMPTY_CLASS, !this._files.length || this._hasInvalidFile(this._files));
  };

  _proto._hasInvalidFile = function _hasInvalidFile(files) {
    for (var i = 0; i < files.length; i++) {
      if (!files[i].isValid()) {
        return true;
      }
    }

    return false;
  };

  _proto._getFileSize = function _getFileSize(size) {
    var i = 0;
    var labels = [_message.default.format('dxFileUploader-bytes'), _message.default.format('dxFileUploader-kb'), _message.default.format('dxFileUploader-Mb'), _message.default.format('dxFileUploader-Gb')];
    var count = labels.length - 1;

    while (i < count && size >= 1024) {
      size /= 1024;
      i++;
    }

    return Math.round(size) + ' ' + labels[i];
  };

  _proto._renderSelectButton = function _renderSelectButton() {
    var $button = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_BUTTON_CLASS).appendTo(this._$inputWrapper);
    this._selectButton = this._createComponent($button, _button.default, {
      text: this.option('selectButtonText'),
      focusStateEnabled: false,
      integrationOptions: {},
      disabled: this.option('readOnly'),
      hoverStateEnabled: this.option('hoverStateEnabled')
    });
    this._selectFileDialogHandler = this._selectButtonClickHandler.bind(this); // NOTE: click triggering on input 'file' works correctly only in native click handler when device is used

    if (_devices.default.real().deviceType === 'desktop') {
      this._selectButton.option('onClick', this._selectFileDialogHandler);
    } else {
      this._attachSelectFileDialogHandler(this._selectButton.$element());
    }

    this._attachSelectFileDialogHandler(this.option('dialogTrigger'));
  };

  _proto._selectButtonClickHandler = function _selectButtonClickHandler() {
    if (this.option('useNativeInputClick')) {
      return;
    }

    if (this._isInteractionDisabled()) {
      return false;
    }

    this._isCustomClickEvent = true;

    _events_engine.default.trigger(this._$fileInput, 'click');

    this._isCustomClickEvent = false;
  };

  _proto._attachSelectFileDialogHandler = function _attachSelectFileDialogHandler(target) {
    if (!(0, _type.isDefined)(target)) {
      return;
    }

    this._detachSelectFileDialogHandler(target);

    _events_engine.default.on((0, _renderer.default)(target), 'click', this._selectFileDialogHandler);
  };

  _proto._detachSelectFileDialogHandler = function _detachSelectFileDialogHandler(target) {
    if (!(0, _type.isDefined)(target)) {
      return;
    }

    _events_engine.default.off((0, _renderer.default)(target), 'click', this._selectFileDialogHandler);
  };

  _proto._renderUploadButton = function _renderUploadButton() {
    if (this.option('uploadMode') !== 'useButtons') {
      return;
    }

    var $uploadButton = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_BUTTON_CLASS).addClass(FILEUPLOADER_UPLOAD_BUTTON_CLASS).appendTo(this._$content);
    this._uploadButton = this._createComponent($uploadButton, _button.default, {
      text: this.option('uploadButtonText'),
      onClick: this._uploadButtonClickHandler.bind(this),
      type: this.option('_uploadButtonType'),
      integrationOptions: {},
      hoverStateEnabled: this.option('hoverStateEnabled')
    });
  };

  _proto._uploadButtonClickHandler = function _uploadButtonClickHandler() {
    this._uploadFiles();
  };

  _proto._shouldDragOverBeRendered = function _shouldDragOverBeRendered() {
    return !this.option('readOnly') && (this.option('uploadMode') !== 'useForm' || this.option('nativeDropSupported'));
  };

  _proto._isInteractionDisabled = function _isInteractionDisabled() {
    return this.option('readOnly') || this.option('disabled');
  };

  _proto._renderInputContainer = function _renderInputContainer() {
    this._$inputContainer = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_INPUT_CONTAINER_CLASS).appendTo(this._$inputWrapper);

    this._$fileInput.addClass(FILEUPLOADER_INPUT_CLASS);

    this._renderInput();

    var labelId = "dx-fileuploader-input-label-".concat(new _guid.default());

    this._$inputLabel.attr('id', labelId).addClass(FILEUPLOADER_INPUT_LABEL_CLASS).appendTo(this._$inputContainer);

    this.setAria('labelledby', labelId, this._$fileInput);
  };

  _proto._renderInput = function _renderInput() {
    if (this.option('useNativeInputClick')) {
      this._selectButton.option('template', this._selectButtonInputTemplate.bind(this));
    } else {
      this._$fileInput.appendTo(this._$inputContainer);

      this._selectButton.option('template', 'content');
    }

    this._applyInputAttributes(this.option('inputAttr'));
  };

  _proto._selectButtonInputTemplate = function _selectButtonInputTemplate(data, content) {
    var $content = (0, _renderer.default)(content);
    var $text = (0, _renderer.default)('<span>').addClass('dx-button-text').text(data.text);
    $content.append($text).append(this._$fileInput);
    return $content;
  };

  _proto._renderInputWrapper = function _renderInputWrapper() {
    this._$inputWrapper = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_INPUT_WRAPPER_CLASS).appendTo(this._$content);
  };

  _proto._detachDragEventHandlers = function _detachDragEventHandlers(target) {
    if (!(0, _type.isDefined)(target)) {
      return;
    }

    _events_engine.default.off((0, _renderer.default)(target), (0, _index.addNamespace)('', this.NAME));
  };

  _proto._attachDragEventHandlers = function _attachDragEventHandlers(target) {
    var isCustomTarget = target !== this._$inputWrapper;

    if (!(0, _type.isDefined)(target) || !this._shouldDragOverBeRendered()) {
      return;
    }

    this._detachDragEventHandlers(target);

    target = (0, _renderer.default)(target);

    _events_engine.default.on(target, (0, _index.addNamespace)('dragenter', this.NAME), this._dragEnterHandler.bind(this, isCustomTarget));

    _events_engine.default.on(target, (0, _index.addNamespace)('dragover', this.NAME), this._dragOverHandler.bind(this, isCustomTarget));

    _events_engine.default.on(target, (0, _index.addNamespace)('dragleave', this.NAME), this._dragLeaveHandler.bind(this, isCustomTarget));

    _events_engine.default.on(target, (0, _index.addNamespace)('drop', this.NAME), this._dropHandler.bind(this, isCustomTarget));
  };

  _proto._applyInputAttributes = function _applyInputAttributes(customAttributes) {
    this._$fileInput.attr(customAttributes);
  };

  _proto._useInputForDrop = function _useInputForDrop() {
    return this.option('nativeDropSupported') && this.option('uploadMode') === 'useForm';
  };

  _proto._getDropZoneElement = function _getDropZoneElement(isCustomTarget, e) {
    var targetList = isCustomTarget ? Array.from((0, _renderer.default)(this.option('dropZone'))) : [this._$inputWrapper];
    targetList = targetList.map(function (element) {
      return (0, _renderer.default)(element).get(0);
    });
    return targetList[targetList.indexOf(e.currentTarget)];
  };

  _proto._dragEnterHandler = function _dragEnterHandler(isCustomTarget, e) {
    if (this.option('disabled')) {
      return false;
    }

    if (!this._useInputForDrop()) {
      e.preventDefault();
    }

    var dropZoneElement = this._getDropZoneElement(isCustomTarget, e);

    if ((0, _type.isDefined)(dropZoneElement) && this._activeDropZone === null && this.isMouseOverElement(e, dropZoneElement, false)) {
      this._activeDropZone = dropZoneElement;

      this._tryToggleDropZoneActive(true, isCustomTarget, e);
    }
  };

  _proto._dragOverHandler = function _dragOverHandler(isCustomTarget, e) {
    if (!this._useInputForDrop()) {
      e.preventDefault();
    }

    e.originalEvent.dataTransfer.dropEffect = 'copy';

    if (!isCustomTarget) {
      // only default dropzone has pseudoelements
      var dropZoneElement = this._getDropZoneElement(false, e);

      if (this._activeDropZone === null && this.isMouseOverElement(e, dropZoneElement, false)) {
        this._dragEnterHandler(false, e);
      }

      if (this._activeDropZone !== null && this._shouldRaiseDragLeave(e, false)) {
        this._dragLeaveHandler(false, e);
      }
    }
  };

  _proto._dragLeaveHandler = function _dragLeaveHandler(isCustomTarget, e) {
    if (!this._useInputForDrop()) {
      e.preventDefault();
    }

    if (this._activeDropZone === null) {
      return;
    }

    if (this._shouldRaiseDragLeave(e, isCustomTarget)) {
      this._tryToggleDropZoneActive(false, isCustomTarget, e);

      this._activeDropZone = null;
    }
  };

  _proto._shouldRaiseDragLeave = function _shouldRaiseDragLeave(e, isCustomTarget) {
    return !this.isMouseOverElement(e, this._activeDropZone, !isCustomTarget);
  };

  _proto._tryToggleDropZoneActive = function _tryToggleDropZoneActive(active, isCustom, event) {
    var classAction = active ? 'addClass' : 'removeClass';
    var mouseAction = active ? '_dropZoneEnterAction' : '_dropZoneLeaveAction';
    this[mouseAction]({
      event: event,
      dropZoneElement: this._activeDropZone
    });

    if (!isCustom) {
      this.$element()[classAction](FILEUPLOADER_DRAGOVER_CLASS);
    }
  };

  _proto._dropHandler = function _dropHandler(isCustomTarget, e) {
    this._activeDropZone = null;

    if (!isCustomTarget) {
      this.$element().removeClass(FILEUPLOADER_DRAGOVER_CLASS);
    }

    if (this._useInputForDrop() || isCustomTarget && this._isInteractionDisabled()) {
      return;
    }

    e.preventDefault();
    var fileList = e.originalEvent.dataTransfer.files;

    var files = this._getFiles(fileList);

    if (!this.option('multiple') && files.length > 1) {
      return;
    }

    this._changeValue(files);

    if (this.option('uploadMode') === 'instantly') {
      this._uploadFiles();
    }
  };

  _proto._handleAllFilesUploaded = function _handleAllFilesUploaded() {
    var areAllFilesLoaded = this._files.every(function (file) {
      return !file.isValid() || file._isError || file._isLoaded || file.isAborted;
    });

    if (areAllFilesLoaded) {
      this._filesUploadedAction();
    }
  };

  _proto._getAllowedFileTypes = function _getAllowedFileTypes(acceptSting) {
    if (!acceptSting.length) {
      return [];
    }

    return acceptSting.split(',').map(function (item) {
      return item.trim();
    });
  };

  _proto._isFileTypeAllowed = function _isFileTypeAllowed(file, allowedTypes) {
    for (var i = 0, n = allowedTypes.length; i < n; i++) {
      var allowedType = allowedTypes[i];

      if (allowedType[0] === '.') {
        allowedType = allowedType.replace('.', '\\.');

        if (file.name.match(new RegExp(allowedType + '$', 'i'))) {
          return true;
        }
      } else {
        allowedType = allowedType.replace(new RegExp('\\*', 'g'), '');

        if (file.type.match(new RegExp(allowedType, 'i'))) {
          return true;
        }
      }
    }

    return false;
  };

  _proto._renderWrapper = function _renderWrapper() {
    var $wrapper = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_WRAPPER_CLASS).appendTo(this.$element());
    var $container = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_CONTAINER_CLASS).appendTo($wrapper);
    this._$content = (0, _renderer.default)('<div>').addClass(FILEUPLOADER_CONTENT_CLASS).appendTo($container);
  };

  _proto._clean = function _clean() {
    this._$fileInput.detach();

    delete this._$filesContainer;

    this._detachSelectFileDialogHandler(this.option('dialogTrigger'));

    this._detachDragEventHandlers(this.option('dropZone'));

    if (this._files) {
      this._files.forEach(function (file) {
        file.$file = null;
        file.$statusMessage = null;
      });
    }

    _Editor.prototype._clean.call(this);
  };

  _proto.abortUpload = function abortUpload(fileData) {
    if (this.option('uploadMode') === 'useForm') {
      return;
    }

    if ((0, _type.isDefined)(fileData)) {
      var file = this._getFile(fileData);

      if (file) {
        this._preventFilesUploading([file]);
      }
    } else {
      this._preventFilesUploading(this._files);
    }
  };

  _proto.upload = function upload(fileData) {
    if (this.option('uploadMode') === 'useForm') {
      return;
    }

    if ((0, _type.isDefined)(fileData)) {
      var file = this._getFile(fileData);

      if (file && isFormDataSupported()) {
        this._uploadFile(file);
      }
    } else {
      this._uploadFiles();
    }
  };

  _proto._uploadFiles = function _uploadFiles() {
    var _this9 = this;

    if (isFormDataSupported()) {
      (0, _iterator.each)(this._files, function (_, file) {
        return _this9._uploadFile(file);
      });
    }
  };

  _proto._uploadFile = function _uploadFile(file) {
    this._uploadStrategy.upload(file);
  };

  _proto._updateProgressBar = function _updateProgressBar(file, loadedFileData) {
    file.progressBar && file.progressBar.option({
      value: loadedFileData.loaded,
      showStatus: true
    });

    this._progressAction({
      file: file.value,
      segmentSize: loadedFileData.currentSegmentSize,
      bytesLoaded: loadedFileData.loaded,
      bytesTotal: loadedFileData.total,
      event: loadedFileData.event,
      request: file.request
    });
  };

  _proto._updateTotalProgress = function _updateTotalProgress(totalFilesSize, totalLoadedFilesSize) {
    var progress = totalFilesSize ? this._getProgressValue(totalLoadedFilesSize / totalFilesSize) : 0;
    this.option('progress', progress);

    this._setLoadedSize(totalLoadedFilesSize);
  };

  _proto._getProgressValue = function _getProgressValue(ratio) {
    return Math.floor(ratio * 100);
  };

  _proto._initStatusMessage = function _initStatusMessage(file) {
    file.$statusMessage.css('display', 'none');
  };

  _proto._ensureCancelButtonInitialized = function _ensureCancelButtonInitialized(file) {
    var _this10 = this;

    if (file.isInitialized) {
      return;
    }

    file.cancelButton.option('onClick', function () {
      _this10._preventFilesUploading([file]);

      _this10._removeFile(file);
    });

    var hideCancelButton = function hideCancelButton() {
      setTimeout(function () {
        file.cancelButton.option({
          visible: false
        });
      }, FILEUPLOADER_AFTER_LOAD_DELAY);
    };

    file.onLoad.add(hideCancelButton);
    file.onError.add(hideCancelButton);
  };

  _proto._createProgressBar = function _createProgressBar(fileSize) {
    var _this11 = this;

    return this._createComponent((0, _renderer.default)('<div>'), _progress_bar.default, {
      value: undefined,
      min: 0,
      max: fileSize,
      statusFormat: function statusFormat(ratio) {
        return _this11._getProgressValue(ratio) + '%';
      },
      showStatus: false,
      statusPosition: 'right'
    });
  };

  _proto._getTotalFilesSize = function _getTotalFilesSize() {
    var _this12 = this;

    if (!this._totalFilesSize) {
      this._totalFilesSize = 0;
      (0, _iterator.each)(this._files, function (_, file) {
        _this12._totalFilesSize += file.value.size;
      });
    }

    return this._totalFilesSize;
  };

  _proto._getTotalLoadedFilesSize = function _getTotalLoadedFilesSize() {
    var _this13 = this;

    if (!this._totalLoadedFilesSize) {
      this._totalLoadedFilesSize = 0;
      (0, _iterator.each)(this._files, function (_, file) {
        _this13._totalLoadedFilesSize += file.loadedSize;
      });
    }

    return this._totalLoadedFilesSize;
  };

  _proto._setLoadedSize = function _setLoadedSize(value) {
    this._totalLoadedFilesSize = value;
  };

  _proto._recalculateProgress = function _recalculateProgress() {
    this._totalFilesSize = 0;
    this._totalLoadedFilesSize = 0;

    this._updateTotalProgress(this._getTotalFilesSize(), this._getTotalLoadedFilesSize());
  };

  _proto.isMouseOverElement = function isMouseOverElement(mouseEvent, element, correctPseudoElements) {
    if (!element) return false;
    var beforeHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':before').height) : 0;
    var afterHeight = correctPseudoElements ? parseFloat(window.getComputedStyle(element, ':after').height) : 0;
    var x = (0, _size.getOffset)(element).left;
    var y = (0, _size.getOffset)(element).top + beforeHeight;
    var w = element.offsetWidth;
    var h = element.offsetHeight - beforeHeight - afterHeight;

    var eventX = this._getEventX(mouseEvent);

    var eventY = this._getEventY(mouseEvent);

    return eventX >= x && eventX < x + w && eventY >= y && eventY < y + h;
  };

  _proto._getEventX = function _getEventX(e) {
    return (0, _index.isTouchEvent)(e) ? this._getTouchEventX(e) : e.clientX + this._getDocumentScrollLeft();
  };

  _proto._getEventY = function _getEventY(e) {
    return (0, _index.isTouchEvent)(e) ? this._getTouchEventY(e) : e.clientY + this._getDocumentScrollTop();
  };

  _proto._getTouchEventX = function _getTouchEventX(e) {
    var touchPoint = null;

    if (e.changedTouches.length > 0) {
      touchPoint = e.changedTouches;
    } else if (e.targetTouches.length > 0) {
      touchPoint = e.targetTouches;
    }

    return touchPoint ? touchPoint[0].pageX : 0;
  };

  _proto._getTouchEventY = function _getTouchEventY(e) {
    var touchPoint = null;

    if (e.changedTouches.length > 0) {
      touchPoint = e.changedTouches;
    } else if (e.targetTouches.length > 0) {
      touchPoint = e.targetTouches;
    }

    return touchPoint ? touchPoint[0].pageY : 0;
  };

  _proto._getDocumentScrollTop = function _getDocumentScrollTop() {
    var document = _dom_adapter.default.getDocument();

    return document.documentElement.scrollTop || document.body.scrollTop;
  };

  _proto._getDocumentScrollLeft = function _getDocumentScrollLeft() {
    var document = _dom_adapter.default.getDocument();

    return document.documentElement.scrollLeft || document.body.scrollLeft;
  };

  _proto._updateReadOnlyState = function _updateReadOnlyState() {
    var readOnly = this.option('readOnly');

    this._selectButton.option('disabled', readOnly);

    this._files.forEach(function (file) {
      var _file$cancelButton;

      return (_file$cancelButton = file.cancelButton) === null || _file$cancelButton === void 0 ? void 0 : _file$cancelButton.option('disabled', readOnly);
    });

    this._updateInputLabelText();

    this._attachDragEventHandlers(this._$inputWrapper);
  };

  _proto._updateHoverState = function _updateHoverState() {
    var _this$_selectButton, _this$_uploadButton;

    var value = this.option('hoverStateEnabled');
    (_this$_selectButton = this._selectButton) === null || _this$_selectButton === void 0 ? void 0 : _this$_selectButton.option('hoverStateEnabled', value);
    (_this$_uploadButton = this._uploadButton) === null || _this$_uploadButton === void 0 ? void 0 : _this$_uploadButton.option('hoverStateEnabled', value);

    this._files.forEach(function (file) {
      var _file$uploadButton, _file$cancelButton2;

      (_file$uploadButton = file.uploadButton) === null || _file$uploadButton === void 0 ? void 0 : _file$uploadButton.option('hoverStateEnabled', value);
      (_file$cancelButton2 = file.cancelButton) === null || _file$cancelButton2 === void 0 ? void 0 : _file$cancelButton2.option('hoverStateEnabled', value);
    });
  };

  _proto._optionChanged = function _optionChanged(args) {
    var name = args.name,
        value = args.value,
        previousValue = args.previousValue;

    switch (name) {
      case 'height':
      case 'width':
        this._updateFileNameMaxWidth();

        _Editor.prototype._optionChanged.call(this, args);

        break;

      case 'value':
        !value.length && this._$fileInput.val('');

        if (!this._preventRecreatingFiles) {
          this._createFiles();

          this._renderFiles();
        }

        this._recalculateProgress();

        _Editor.prototype._optionChanged.call(this, args);

        break;

      case 'name':
        this._initFileInput();

        _Editor.prototype._optionChanged.call(this, args);

        break;

      case 'accept':
        this._initFileInput();

        break;

      case 'multiple':
        this._initFileInput();

        if (!args.value) {
          this.reset();
        }

        break;

      case 'readOnly':
        this._updateReadOnlyState();

        _Editor.prototype._optionChanged.call(this, args);

        break;

      case 'selectButtonText':
        this._selectButton.option('text', value);

        break;

      case 'uploadButtonText':
        this._uploadButton && this._uploadButton.option('text', value);
        break;

      case '_uploadButtonType':
        this._uploadButton && this._uploadButton.option('type', value);
        break;

      case 'dialogTrigger':
        this._detachSelectFileDialogHandler(previousValue);

        this._attachSelectFileDialogHandler(value);

        break;

      case 'dropZone':
        this._detachDragEventHandlers(previousValue);

        this._attachDragEventHandlers(value);

        break;

      case 'maxFileSize':
      case 'minFileSize':
      case 'allowedFileExtensions':
      case 'invalidFileExtensionMessage':
      case 'invalidMaxFileSizeMessage':
      case 'invalidMinFileSizeMessage':
      case 'readyToUploadMessage':
      case 'uploadedMessage':
      case 'uploadFailedMessage':
      case 'uploadAbortedMessage':
        this._invalidate();

        break;

      case 'labelText':
        this._updateInputLabelText();

        break;

      case 'showFileList':
        if (!this._preventRecreatingFiles) {
          this._renderFiles();
        }

        break;

      case 'uploadFile':
      case 'uploadChunk':
      case 'chunkSize':
        this._setUploadStrategy();

        break;

      case 'abortUpload':
      case 'uploadUrl':
      case 'progress':
      case 'uploadMethod':
      case 'uploadHeaders':
      case 'uploadCustomData':
      case 'extendSelection':
        break;

      case 'hoverStateEnabled':
        this._updateHoverState();

        _Editor.prototype._optionChanged.call(this, args);

        break;

      case 'allowCanceling':
      case 'uploadMode':
        this.reset();

        this._invalidate();

        break;

      case 'onBeforeSend':
        this._createBeforeSendAction();

        break;

      case 'onUploadStarted':
        this._createUploadStartedAction();

        break;

      case 'onUploaded':
        this._createUploadedAction();

        break;

      case 'onFilesUploaded':
        this._createFilesUploadedAction();

        break;

      case 'onProgress':
        this._createProgressAction();

        break;

      case 'onUploadError':
        this._createUploadErrorAction();

        break;

      case 'onUploadAborted':
        this._createUploadAbortedAction();

        break;

      case 'onDropZoneEnter':
        this._createDropZoneEnterAction();

        break;

      case 'onDropZoneLeave':
        this._createDropZoneLeaveAction();

        break;

      case 'useNativeInputClick':
        this._renderInput();

        break;

      case 'useDragOver':
        this._attachDragEventHandlers(this._$inputWrapper);

        break;

      case 'nativeDropSupported':
        this._invalidate();

        break;

      case 'inputAttr':
        this._applyInputAttributes(this.option(name));

        break;

      default:
        _Editor.prototype._optionChanged.call(this, args);

    }
  };

  _proto._resetInputValue = function _resetInputValue(force) {
    if (this.option('uploadMode') === 'useForm' && !force) {
      return;
    }

    this._doPreventInputChange = true;

    this._$fileInput.val('');

    this._doPreventInputChange = false;
  };

  _proto.reset = function reset() {
    this.option('value', []);
  };

  return FileUploader;
}(_editor.default); ///#DEBUG


FileUploader.__internals = {
  changeFileInputRenderer: function changeFileInputRenderer(renderer) {
    renderFileUploaderInput = renderer;
  },
  resetFileInputTag: function resetFileInputTag() {
    renderFileUploaderInput = function renderFileUploaderInput() {
      return (0, _renderer.default)('<input>').attr('type', 'file');
    };
  }
}; ///#ENDDEBUG

var FileBlobReader = /*#__PURE__*/function () {
  function FileBlobReader(file, chunkSize) {
    this.file = file;
    this.chunkSize = chunkSize;
    this.index = 0;
  }

  var _proto2 = FileBlobReader.prototype;

  _proto2.read = function read() {
    if (!this.file) {
      return null;
    }

    var result = this.createBlobResult(this.file, this.index, this.chunkSize);

    if (result.isCompleted) {
      this.file = null;
    }

    this.index++;
    return result;
  };

  _proto2.createBlobResult = function createBlobResult(file, index, chunkSize) {
    var currentPosition = index * chunkSize;
    return {
      blob: this.sliceFile(file, currentPosition, chunkSize),
      index: index,
      isCompleted: currentPosition + chunkSize >= file.size
    };
  };

  _proto2.sliceFile = function sliceFile(file, startPos, length) {
    if (file.slice) {
      return file.slice(startPos, startPos + length);
    }

    if (file.webkitSlice) {
      return file.webkitSlice(startPos, startPos + length);
    }

    return null;
  };

  return FileBlobReader;
}();

var FileUploadStrategyBase = /*#__PURE__*/function () {
  function FileUploadStrategyBase(fileUploader) {
    this.fileUploader = fileUploader;
  }

  var _proto3 = FileUploadStrategyBase.prototype;

  _proto3.upload = function upload(file) {
    if (file.isInitialized && file.isAborted) {
      this.fileUploader._resetFileState(file);
    }

    if (file.isValid() && !file.uploadStarted) {
      this._prepareFileBeforeUpload(file);

      this._uploadCore(file);
    }
  };

  _proto3.abortUpload = function abortUpload(file) {
    var _this14 = this;

    if (file._isError || file._isLoaded || file.isAborted || !file.uploadStarted) {
      return;
    }

    file.isAborted = true;
    file.request && file.request.abort();

    if (this._isCustomCallback('abortUpload')) {
      var abortUpload = this.fileUploader.option('abortUpload');

      var arg = this._createUploadArgument(file);

      var deferred = null;

      try {
        var result = abortUpload(file.value, arg);
        deferred = (0, _deferred.fromPromise)(result);
      } catch (error) {
        deferred = new _deferred.Deferred().reject(error).promise();
      }

      deferred.done(function () {
        return file.onAbort.fire();
      }).fail(function (error) {
        return _this14._handleFileError(file, error);
      });
    }
  };

  _proto3._beforeSend = function _beforeSend(xhr, file) {
    var arg = this._createUploadArgument(file);

    this.fileUploader._beforeSendAction({
      request: xhr,
      file: file.value,
      uploadInfo: arg
    });

    file.request = xhr;
  };

  _proto3._createUploadArgument = function _createUploadArgument(file) {};

  _proto3._uploadCore = function _uploadCore(file) {};

  _proto3._isCustomCallback = function _isCustomCallback(name) {
    var callback = this.fileUploader.option(name);
    return callback && (0, _type.isFunction)(callback);
  };

  _proto3._handleProgress = function _handleProgress(file, e) {
    if (file._isError) {
      return;
    }

    file._isProgressStarted = true;

    this._handleProgressCore(file, e);
  };

  _proto3._handleProgressCore = function _handleProgressCore(file, e) {};

  _proto3._handleFileError = function _handleFileError(file, error) {
    file._isError = true;
    file.onError.fire(error);
  };

  _proto3._prepareFileBeforeUpload = function _prepareFileBeforeUpload(file) {
    if (file.$file) {
      var _file$progressBar;

      (_file$progressBar = file.progressBar) === null || _file$progressBar === void 0 ? void 0 : _file$progressBar.dispose();

      this.fileUploader._createFileProgressBar(file);
    }

    if (file.isInitialized) {
      return;
    }

    file.onLoadStart.add(this._onUploadStarted.bind(this, file));
    file.onLoad.add(this._onLoadedHandler.bind(this, file));
    file.onError.add(this._onErrorHandler.bind(this, file));
    file.onAbort.add(this._onAbortHandler.bind(this, file));
    file.onProgress.add(this._onProgressHandler.bind(this, file));
    file.isInitialized = true;
  };

  _proto3._shouldHandleError = function _shouldHandleError(file, e) {
    return (this._isStatusError(e.status) || !file._isProgressStarted) && !file.isAborted;
  };

  _proto3._isStatusError = function _isStatusError(status) {
    return 400 <= status && status < 500 || 500 <= status && status < 600;
  };

  _proto3._onUploadStarted = function _onUploadStarted(file, e) {
    file.uploadStarted = true;

    this.fileUploader._uploadStartedAction({
      file: file.value,
      event: e,
      request: file.request
    });
  };

  _proto3._onAbortHandler = function _onAbortHandler(file, e) {
    var args = {
      file: file.value,
      event: e,
      request: file.request,
      message: this.fileUploader._getUploadAbortedStatusMessage()
    };

    this.fileUploader._uploadAbortedAction(args);

    this.fileUploader._setStatusMessage(file, args.message);

    this.fileUploader._handleAllFilesUploaded();
  };

  _proto3._onErrorHandler = function _onErrorHandler(file, error) {
    var args = {
      file: file.value,
      event: undefined,
      request: file.request,
      error: error,
      message: this.fileUploader.option('uploadFailedMessage')
    };

    this.fileUploader._uploadErrorAction(args);

    this.fileUploader._setStatusMessage(file, args.message);

    this.fileUploader._handleAllFilesUploaded();
  };

  _proto3._onLoadedHandler = function _onLoadedHandler(file, e) {
    var args = {
      file: file.value,
      event: e,
      request: file.request,
      message: this.fileUploader.option('uploadedMessage')
    };
    file._isLoaded = true;

    this.fileUploader._uploadedAction(args);

    this.fileUploader._setStatusMessage(file, args.message);

    this.fileUploader._handleAllFilesUploaded();
  };

  _proto3._onProgressHandler = function _onProgressHandler(file, e) {
    if (file) {
      var totalFilesSize = this.fileUploader._getTotalFilesSize();

      var totalLoadedFilesSize = this.fileUploader._getTotalLoadedFilesSize();

      var loadedSize = Math.min(e.loaded, file.value.size);
      var segmentSize = loadedSize - file.loadedSize;
      file.loadedSize = loadedSize;

      this.fileUploader._updateTotalProgress(totalFilesSize, totalLoadedFilesSize + segmentSize);

      this.fileUploader._updateProgressBar(file, this._getLoadedData(loadedSize, e.total, segmentSize, e));
    }
  };

  _proto3._getLoadedData = function _getLoadedData(loaded, total, currentSegmentSize, event) {
    return {
      loaded: loaded,
      total: total,
      currentSegmentSize: currentSegmentSize
    };
  };

  _proto3._extendFormData = function _extendFormData(formData) {
    var formDataEntries = this.fileUploader.option('uploadCustomData');

    for (var entryName in formDataEntries) {
      if (Object.prototype.hasOwnProperty.call(formDataEntries, entryName) && (0, _type.isDefined)(formDataEntries[entryName])) {
        formData.append(entryName, formDataEntries[entryName]);
      }
    }
  };

  return FileUploadStrategyBase;
}();

var ChunksFileUploadStrategyBase = /*#__PURE__*/function (_FileUploadStrategyBa) {
  _inheritsLoose(ChunksFileUploadStrategyBase, _FileUploadStrategyBa);

  function ChunksFileUploadStrategyBase(fileUploader) {
    var _this15;

    _this15 = _FileUploadStrategyBa.call(this, fileUploader) || this;
    _this15.chunkSize = _this15.fileUploader.option('chunkSize');
    return _this15;
  }

  var _proto4 = ChunksFileUploadStrategyBase.prototype;

  _proto4._uploadCore = function _uploadCore(file) {
    var realFile = file.value;
    var chunksData = {
      name: realFile.name,
      loadedBytes: 0,
      type: realFile.type,
      blobReader: new FileBlobReader(realFile, this.chunkSize),
      guid: new _guid.default(),
      fileSize: realFile.size,
      count: Math.ceil(realFile.size / this.chunkSize),
      customData: {}
    };
    file.chunksData = chunksData;

    this._sendChunk(file, chunksData);
  };

  _proto4._sendChunk = function _sendChunk(file, chunksData) {
    var _this16 = this;

    var chunk = chunksData.blobReader.read();
    chunksData.currentChunk = chunk;

    if (chunk) {
      this._sendChunkCore(file, chunksData, chunk).done(function () {
        if (file.isAborted) {
          return;
        }

        chunksData.loadedBytes += chunk.blob.size;
        file.onProgress.fire({
          loaded: chunksData.loadedBytes,
          total: file.value.size
        });

        if (chunk.isCompleted) {
          file.onLoad.fire();
        }

        setTimeout(function () {
          return _this16._sendChunk(file, chunksData);
        });
      }).fail(function (error) {
        if (_this16._shouldHandleError(file, error)) {
          _this16._handleFileError(file, error);
        }
      });
    }
  };

  _proto4._sendChunkCore = function _sendChunkCore(file, chunksData, chunk) {};

  _proto4._tryRaiseStartLoad = function _tryRaiseStartLoad(file) {
    if (!file.isStartLoad) {
      file.isStartLoad = true;
      file.onLoadStart.fire();
    }
  };

  _proto4._getEvent = function _getEvent(e) {
    return null;
  };

  _proto4._createUploadArgument = function _createUploadArgument(file) {
    return this._createChunksInfo(file.chunksData);
  };

  _proto4._createChunksInfo = function _createChunksInfo(chunksData) {
    return {
      bytesUploaded: chunksData.loadedBytes,
      chunkCount: chunksData.count,
      customData: chunksData.customData,
      chunkBlob: chunksData.currentChunk.blob,
      chunkIndex: chunksData.currentChunk.index
    };
  };

  return ChunksFileUploadStrategyBase;
}(FileUploadStrategyBase);

var DefaultChunksFileUploadStrategy = /*#__PURE__*/function (_ChunksFileUploadStra) {
  _inheritsLoose(DefaultChunksFileUploadStrategy, _ChunksFileUploadStra);

  function DefaultChunksFileUploadStrategy() {
    return _ChunksFileUploadStra.apply(this, arguments) || this;
  }

  var _proto5 = DefaultChunksFileUploadStrategy.prototype;

  _proto5._sendChunkCore = function _sendChunkCore(file, chunksData, chunk) {
    var _this17 = this;

    return _ajax.default.sendRequest({
      url: this.fileUploader.option('uploadUrl'),
      method: this.fileUploader.option('uploadMethod'),
      headers: this.fileUploader.option('uploadHeaders'),
      beforeSend: function beforeSend(xhr) {
        return _this17._beforeSend(xhr, file);
      },
      upload: {
        'onprogress': function onprogress(e) {
          return _this17._handleProgress(file, e);
        },
        'onloadstart': function onloadstart() {
          return _this17._tryRaiseStartLoad(file);
        },
        'onabort': function onabort() {
          return file.onAbort.fire();
        }
      },
      data: this._createFormData({
        fileName: chunksData.name,
        blobName: this.fileUploader.option('name'),
        blob: chunk.blob,
        index: chunk.index,
        count: chunksData.count,
        type: chunksData.type,
        guid: chunksData.guid,
        size: chunksData.fileSize
      })
    });
  };

  _proto5._createFormData = function _createFormData(options) {
    var formData = new window.FormData();
    formData.append(options.blobName, options.blob);
    formData.append(FILEUPLOADER_CHUNK_META_DATA_NAME, JSON.stringify({
      FileName: options.fileName,
      Index: options.index,
      TotalCount: options.count,
      FileSize: options.size,
      FileType: options.type,
      FileGuid: options.guid
    }));

    this._extendFormData(formData);

    return formData;
  };

  return DefaultChunksFileUploadStrategy;
}(ChunksFileUploadStrategyBase);

var CustomChunksFileUploadStrategy = /*#__PURE__*/function (_ChunksFileUploadStra2) {
  _inheritsLoose(CustomChunksFileUploadStrategy, _ChunksFileUploadStra2);

  function CustomChunksFileUploadStrategy() {
    return _ChunksFileUploadStra2.apply(this, arguments) || this;
  }

  var _proto6 = CustomChunksFileUploadStrategy.prototype;

  _proto6._sendChunkCore = function _sendChunkCore(file, chunksData) {
    this._tryRaiseStartLoad(file);

    var chunksInfo = this._createChunksInfo(chunksData);

    var uploadChunk = this.fileUploader.option('uploadChunk');

    try {
      var result = uploadChunk(file.value, chunksInfo);
      return (0, _deferred.fromPromise)(result);
    } catch (error) {
      return new _deferred.Deferred().reject(error).promise();
    }
  };

  _proto6._shouldHandleError = function _shouldHandleError(file, error) {
    return true;
  };

  return CustomChunksFileUploadStrategy;
}(ChunksFileUploadStrategyBase);

var WholeFileUploadStrategyBase = /*#__PURE__*/function (_FileUploadStrategyBa2) {
  _inheritsLoose(WholeFileUploadStrategyBase, _FileUploadStrategyBa2);

  function WholeFileUploadStrategyBase() {
    return _FileUploadStrategyBa2.apply(this, arguments) || this;
  }

  var _proto7 = WholeFileUploadStrategyBase.prototype;

  _proto7._uploadCore = function _uploadCore(file) {
    var _this18 = this;

    file.loadedSize = 0;

    this._uploadFile(file).done(function () {
      if (!file.isAborted) {
        file.onLoad.fire();
      }
    }).fail(function (error) {
      if (_this18._shouldHandleError(file, error)) {
        _this18._handleFileError(file, error);
      }
    });
  };

  _proto7._uploadFile = function _uploadFile(file) {};

  _proto7._handleProgressCore = function _handleProgressCore(file, e) {
    file.onProgress.fire(e);
  };

  _proto7._getLoadedData = function _getLoadedData(loaded, total, segmentSize, event) {
    var result = _FileUploadStrategyBa2.prototype._getLoadedData.call(this, loaded, total, segmentSize, event);

    result.event = event;
    return result;
  };

  return WholeFileUploadStrategyBase;
}(FileUploadStrategyBase);

var DefaultWholeFileUploadStrategy = /*#__PURE__*/function (_WholeFileUploadStrat) {
  _inheritsLoose(DefaultWholeFileUploadStrategy, _WholeFileUploadStrat);

  function DefaultWholeFileUploadStrategy() {
    return _WholeFileUploadStrat.apply(this, arguments) || this;
  }

  var _proto8 = DefaultWholeFileUploadStrategy.prototype;

  _proto8._uploadFile = function _uploadFile(file) {
    var _this19 = this;

    return _ajax.default.sendRequest({
      url: this.fileUploader.option('uploadUrl'),
      method: this.fileUploader.option('uploadMethod'),
      headers: this.fileUploader.option('uploadHeaders'),
      beforeSend: function beforeSend(xhr) {
        return _this19._beforeSend(xhr, file);
      },
      upload: {
        'onprogress': function onprogress(e) {
          return _this19._handleProgress(file, e);
        },
        'onloadstart': function onloadstart() {
          return file.onLoadStart.fire();
        },
        'onabort': function onabort() {
          return file.onAbort.fire();
        }
      },
      data: this._createFormData(this.fileUploader.option('name'), file.value)
    });
  };

  _proto8._createFormData = function _createFormData(fieldName, fieldValue) {
    var formData = new window.FormData();
    formData.append(fieldName, fieldValue, fieldValue.name);

    this._extendFormData(formData);

    return formData;
  };

  return DefaultWholeFileUploadStrategy;
}(WholeFileUploadStrategyBase);

var CustomWholeFileUploadStrategy = /*#__PURE__*/function (_WholeFileUploadStrat2) {
  _inheritsLoose(CustomWholeFileUploadStrategy, _WholeFileUploadStrat2);

  function CustomWholeFileUploadStrategy() {
    return _WholeFileUploadStrat2.apply(this, arguments) || this;
  }

  var _proto9 = CustomWholeFileUploadStrategy.prototype;

  _proto9._uploadFile = function _uploadFile(file) {
    var _this20 = this;

    file.onLoadStart.fire();

    var progressCallback = function progressCallback(loadedBytes) {
      var arg = {
        loaded: loadedBytes,
        total: file.size
      };

      _this20._handleProgress(file, arg);
    };

    var uploadFile = this.fileUploader.option('uploadFile');

    try {
      var result = uploadFile(file.value, progressCallback);
      return (0, _deferred.fromPromise)(result);
    } catch (error) {
      return new _deferred.Deferred().reject(error).promise();
    }
  };

  _proto9._shouldHandleError = function _shouldHandleError(file, e) {
    return true;
  };

  return CustomWholeFileUploadStrategy;
}(WholeFileUploadStrategyBase);

(0, _component_registrator.default)('dxFileUploader', FileUploader);
var _default = FileUploader;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;