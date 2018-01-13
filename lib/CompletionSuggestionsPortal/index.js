"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CompletionSuggestionsPortal = function (_React$Component) {
  _inherits(CompletionSuggestionsPortal, _React$Component);

  function CompletionSuggestionsPortal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CompletionSuggestionsPortal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CompletionSuggestionsPortal.__proto__ || Object.getPrototypeOf(CompletionSuggestionsPortal)).call.apply(_ref, [this].concat(args))), _this), _this.searchPortal = null, _this.searchPortalRef = function (ref) {
      _this.searchPortal = ref;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CompletionSuggestionsPortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var store = this.props.store;

      store.register(this.props.offsetKey);
      this.updatePortalClientRect(this.props);
      this.props.setEditorState(this.props.getEditorState());
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.updatePortalClientRect(nextProps);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var store = this.props.store;

      store.unregister(this.props.offsetKey);
    }
  }, {
    key: "updatePortalClientRect",
    value: function updatePortalClientRect(props) {
      var _this2 = this;

      this.props.store.updatePortalClientRect(props.offsetKey, function () {
        return _this2.searchPortal.getBoundingClientRect();
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "span",
        { className: this.key, ref: this.searchPortalRef },
        this.props.children
      );
    }
  }]);

  return CompletionSuggestionsPortal;
}(React.Component);

exports.default = CompletionSuggestionsPortal;