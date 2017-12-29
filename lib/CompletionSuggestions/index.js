"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _propTypes = require("prop-types");

var PropTypes = _interopRequireWildcard(_propTypes);

var _draftJs = require("draft-js");

var _decodeOffsetKey = require("../utils/decodeOffsetKey");

var _decodeOffsetKey2 = _interopRequireDefault(_decodeOffsetKey);

var _getSearchText = require("../utils/getSearchText");

var _getSearchText2 = _interopRequireDefault(_getSearchText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createCompletionSuggestions = function createCompletionSuggestions(modifier, Entry, suggestionsThemeKey) {
  var _class, _temp2;

  return _temp2 = _class = function (_React$Component) {
    _inherits(CompletionSuggestions, _React$Component);

    function CompletionSuggestions() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, CompletionSuggestions);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CompletionSuggestions.__proto__ || Object.getPrototypeOf(CompletionSuggestions)).call.apply(_ref, [this].concat(args))), _this), _this.popoverRef = function (ref) {
        return _this.popover = ref;
      }, _this.state = {
        isActive: false,
        focusedOptionIndex: 0
      }, _this.onEditorStateChange = function (editorState) {
        var store = _this.props.store;

        var searches = store.getAllSearches();

        // if no search portal is active there is no need to show the popover
        if (searches.size === 0) {
          return editorState;
        }

        var removeList = function removeList() {
          store.resetEscapedSearch();
          _this.closeDropdown();
          return editorState;
        };

        // get the current selection
        var selection = editorState.getSelection();
        var anchorKey = selection.getAnchorKey();
        var anchorOffset = selection.getAnchorOffset();

        // the list should not be visible if a range is selected or the editor has no focus
        if (!selection.isCollapsed() || !selection.getHasFocus()) return removeList();

        // identify the start & end positon of each search-text
        var offsetDetails = searches.map(function (offsetKey) {
          return (0, _decodeOffsetKey2.default)(offsetKey);
        });

        // a leave can be empty when it is removed due e.g. using backspace
        var leaves = offsetDetails.filter(function (_ref2) {
          var blockKey = _ref2.blockKey;
          return blockKey === anchorKey;
        }).map(function (_ref3) {
          var blockKey = _ref3.blockKey,
              decoratorKey = _ref3.decoratorKey,
              leafKey = _ref3.leafKey;
          return editorState.getBlockTree(blockKey).getIn([decoratorKey, "leaves", leafKey]);
        });

        // if all leaves are undefined the popover should be removed
        if (leaves.every(function (leave) {
          return leave === undefined;
        })) {
          return removeList();
        }

        // Checks that the cursor is after the 'autocomplete' character but still somewhere in
        // the word (search term). Setting it to allow the cursor to be left of
        // the 'autocomplete character' causes troubles due selection confusion.
        var selectionIsInsideWord = leaves.filter(function (leave) {
          return leave !== undefined;
        }).map(function (_ref4) {
          var start = _ref4.start,
              end = _ref4.end;
          return start === 0 && anchorOffset === 1 && anchorOffset <= end || // @ is the first character
          anchorOffset > start + 1 && anchorOffset <= end;
        } // @ is in the text or at the end
        );

        if (selectionIsInsideWord.every(function (isInside) {
          return isInside === false;
        })) return removeList();

        _this.activeOffsetKey = selectionIsInsideWord.filter(function (value) {
          return value === true;
        }).keySeq().first();

        _this.onSearchChange(editorState, selection);

        // make sure the escaped search is reseted in the cursor since the user
        // already switched to another completion search
        if (!store.isEscaped(_this.activeOffsetKey)) {
          store.resetEscapedSearch();
        }

        // If none of the above triggered to close the window, it's safe to assume
        // the dropdown should be open. This is useful when a user focuses on another
        // input field and then comes back: the dropdown will again.
        if (!_this.state.isActive && !store.isEscaped(_this.activeOffsetKey) && _this.props.suggestions.length > 0) {
          _this.openDropdown();
        }

        // makes sure the focused index is reseted every time a new selection opens
        // or the selection was moved to another completion search
        if (_this.lastSelectionIsInsideWord === undefined || !selectionIsInsideWord.equals(_this.lastSelectionIsInsideWord)) {
          _this.setState({
            focusedOptionIndex: 0
          });
        }

        _this.lastSelectionIsInsideWord = selectionIsInsideWord;

        return editorState;
      }, _this.onSearchChange = function (editorState, selection) {
        var searchText = (0, _getSearchText2.default)(editorState, selection);
        var searchValue = searchText.word;
        if (_this.lastSearchValue !== searchValue) {
          _this.lastSearchValue = searchValue;
          _this.props.onSearchChange({ value: searchValue });
        }
      }, _this.onDownArrow = function (keyboardEvent) {
        if (_this.state.isActive) {
          keyboardEvent.preventDefault();
          var newIndex = _this.state.focusedOptionIndex + 1;
          _this.onCompletionFocus(newIndex >= _this.props.suggestions.length ? 0 : newIndex);
        }
      }, _this.onTab = function (keyboardEvent) {
        if (_this.state.isActive) {
          keyboardEvent.preventDefault();
          _this.commitSelection();
        }
      }, _this.onUpArrow = function (keyboardEvent) {
        if (_this.state.isActive) {
          var suggestions = _this.props.suggestions;

          keyboardEvent.preventDefault();
          if (suggestions.length > 0) {
            var newIndex = _this.state.focusedOptionIndex - 1;
            _this.onCompletionFocus(newIndex < 0 ? suggestions.length - 1 : newIndex);
          }
        }
      }, _this.onEscape = function (keyboardEvent) {
        if (_this.state.isActive) {
          keyboardEvent.preventDefault();
          keyboardEvent.stopPropagation();

          var activeOffsetKey = _this.lastSelectionIsInsideWord.filter(function (value) {
            return value === true;
          }).keySeq().first();
          _this.props.store.escapeSearch(activeOffsetKey);
          _this.closeDropdown();

          // to force a re-render of the outer component to change the aria props
          _this.props.store.setEditorState(_this.props.store.getEditorState());
        }
      }, _this.onCompletionSelect = function (completion) {
        if (!_this.state.isActive || !completion) {
          return;
        }

        if (_this.props.onSelect) {
          _this.props.onSelect(completion);
        }

        _this.closeDropdown();
        var newEditorState = modifier(_this.props.store.getEditorState(), completion);
        _this.props.store.setEditorState(newEditorState);
      }, _this.onCompletionFocus = function (index) {
        var descendant = "completion-option-" + _this.key + "-" + index;
        _this.props.ariaProps.ariaActiveDescendantID = descendant;
        _this.setState({ focusedOptionIndex: index });

        // to force a re-render of the outer component to change the aria props
        _this.props.store.setEditorState(_this.props.store.getEditorState());
      }, _this.commitSelection = function (event) {
        if (_this.state.isActive) {
          _this.onCompletionSelect(_this.props.suggestions[_this.state.focusedOptionIndex]);
          return 'handled';
        }
      }, _this.openDropdown = function () {
        var _this$props = _this.props,
            callbacks = _this$props.callbacks,
            ariaProps = _this$props.ariaProps,
            onOpen = _this$props.onOpen;
        // This is a really nasty way of attaching & releasing the key related functions.
        // It assumes that the keyFunctions object will not loose its reference and
        // by this we can replace inner parameters spread over different modules.
        // This better be some registering & unregistering logic. PRs are welcome :)

        callbacks.onDownArrow = _this.onDownArrow;
        callbacks.onUpArrow = _this.onUpArrow;
        callbacks.onEscape = _this.onEscape;
        callbacks.handleReturn = _this.commitSelection;
        callbacks.onTab = _this.onTab;

        var descendant = "completion-option-" + _this.key + "-" + _this.state.focusedOptionIndex;
        ariaProps.ariaActiveDescendantID = descendant;
        ariaProps.ariaOwneeID = "completions-list-" + _this.key;
        ariaProps.ariaHasPopup = "true";
        ariaProps.ariaExpanded = "true";
        _this.setState({
          isActive: true
        });

        if (onOpen) {
          onOpen();
        }
      }, _this.closeDropdown = function () {
        var _this$props2 = _this.props,
            callbacks = _this$props2.callbacks,
            ariaProps = _this$props2.ariaProps,
            onClose = _this$props2.onClose;
        // make sure none of these callbacks are triggered

        callbacks.onDownArrow = undefined;
        callbacks.onUpArrow = undefined;
        callbacks.onTab = undefined;
        callbacks.onEscape = undefined;
        callbacks.handleReturn = undefined;
        ariaProps.ariaHasPopup = "false";
        ariaProps.ariaExpanded = "false";
        ariaProps.ariaActiveDescendantID = undefined;
        ariaProps.ariaOwneeID = undefined;
        _this.setState({
          isActive: false
        });

        if (onClose) {
          onClose();
        }
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CompletionSuggestions, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        this.key = (0, _draftJs.genKey)();
        this.props.callbacks.onChange = this.onEditorStateChange;
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        var suggestions = this.props.suggestions;
        var isActive = this.state.isActive;

        if (suggestions.length === 0 && isActive) {
          this.closeDropdown();
        } else if (suggestions.length > 0 && !isActive && suggestions !== this.props.suggestions) {
          this.openDropdown();
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        var _this2 = this;

        if (this.popover && this.props.store.getAllSearches().has(this.activeOffsetKey)) {
          // In case the list shrinks there should be still an option focused.
          // Note: this might run multiple times and deduct 1 until the condition is
          // not fullfilled anymore.
          var size = this.props.suggestions.length;
          if (size > 0 && this.state.focusedOptionIndex >= size) {
            this.setState({
              focusedOptionIndex: size - 1
            });
          }

          var decoratorRect = this.props.store.getPortalClientRect(this.activeOffsetKey);
          if (decoratorRect) {
            var newStyles = this.props.positionSuggestions({
              decoratorRect: decoratorRect,
              prevProps: prevProps,
              prevState: prevState,
              props: this.props,
              state: this.state,
              popover: this.popover
            });
            Object.keys(newStyles).forEach(function (key) {
              _this2.popover.style[key] = newStyles[key];
            });
          }
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.props.callbacks.onChange = undefined;
      }
    }, {
      key: "render",
      value: function render() {
        var _this3 = this;

        if (!this.state.isActive) {
          return null;
        }

        var _props = this.props,
            callbacks = _props.callbacks,
            ariaProps = _props.ariaProps,
            suggestions = _props.suggestions,
            onSearchChange = _props.onSearchChange,
            _props$theme = _props.theme,
            theme = _props$theme === undefined ? {} : _props$theme,
            store = _props.store,
            entityMutability = _props.entityMutability,
            positionSuggestions = _props.positionSuggestions,
            elementProps = _objectWithoutProperties(_props, ["callbacks", "ariaProps", "suggestions", "onSearchChange", "theme", "store", "entityMutability", "positionSuggestions"]);

        return React.createElement(
          "div",
          _extends({}, elementProps, {
            className: theme[suggestionsThemeKey],
            role: "listbox",
            id: "completions-list-" + this.key,
            ref: this.popoverRef
          }),
          this.props.suggestions.map(function (completion, index) {
            return React.createElement(Entry, {
              key: index,
              onCompletionSelect: _this3.onCompletionSelect,
              onCompletionFocus: _this3.onCompletionFocus,
              isFocused: _this3.state.focusedOptionIndex === index,
              completion: completion,
              index: index,
              id: "completion-option-" + _this3.key + "-" + index,
              theme: theme
            });
          })
        );
      }
    }]);

    return CompletionSuggestions;
  }(React.Component), _class.propTypes = {
    entityMutability: PropTypes.oneOf(["SEGMENTED", "IMMUTABLE", "MUTABLE"]),
    suggestions: PropTypes.arrayOf(PropTypes.object).isRequired
  }, _temp2;
};

exports.default = createCompletionSuggestions;