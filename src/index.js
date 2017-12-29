import completionSuggestionsCreator from './CompletionSuggestions';
import CompletionSuggestionsPortal from './CompletionSuggestionsPortal';
import decorateComponentWithProps from 'decorate-component-with-props';
import { Map } from 'immutable';
import suggestionsFilter from './utils/defaultSuggestionsFilter';
import defaultPositionSuggestions from './utils/positionSuggestions';
import getSearchText from './utils/getSearchText';

const createCompletionPlugin = (
  completionSuggestionsStrategy,
  addModifier,
  SuggestionEntry,
  suggestionsThemeKey = 'completionSuggestions',
  additionalDecorators = [],
) => (config = {}) => {
  const callbacks = {
    keyBindingFn: undefined,
    handleKeyCommand: undefined,
    onDownArrow: undefined,
    onUpArrow: undefined,
    onTab: undefined,
    onEscape: undefined,
    handleReturn: undefined,
    onChange: undefined,
  };

  const ariaProps = {
    ariaHasPopup: 'false',
    ariaExpanded: 'false',
    ariaOwneeID: undefined,
    ariaActiveDescendantID: undefined,
  };

  let searches = Map();
  let escapedSearch = undefined;
  let clientRectFunctions = Map();
  let isOpened;

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getPortalClientRect: (offsetKey) => clientRectFunctions.get(offsetKey)(),
    getAllSearches: () => searches,
    isEscaped: (offsetKey) => escapedSearch === offsetKey,
    escapeSearch: (offsetKey) => {
      escapedSearch = offsetKey;
    },

    resetEscapedSearch: () => {
      escapedSearch = undefined;
    },

    register: (offsetKey) => {
      searches = searches.set(offsetKey, offsetKey);
    },

    updatePortalClientRect: (offsetKey, func) => {
      clientRectFunctions = clientRectFunctions.set(offsetKey, func);
    },

    unregister: (offsetKey) => {
      searches = searches.delete(offsetKey);
      clientRectFunctions = clientRectFunctions.delete(offsetKey);
    },

    getIsOpened: () => isOpened,
    setIsOpened: nextIsOpened => {
      isOpened = nextIsOpened;
    }
  };

  const {
    theme = {},
    positionSuggestions = defaultPositionSuggestions,
  } = config;
  const completionSearchProps = {
    ariaProps,
    callbacks,
    theme,
    store,
    entityMutability: config.entityMutability ? config.entityMutability : 'SEGMENTED',
    positionSuggestions,
  };
  const CompletionSuggestions = completionSuggestionsCreator(addModifier, SuggestionEntry, suggestionsThemeKey);
  return {
    CompletionSuggestions: decorateComponentWithProps(CompletionSuggestions, completionSearchProps),
    decorators: [
      {
        strategy: completionSuggestionsStrategy,
        component: decorateComponentWithProps(CompletionSuggestionsPortal, { store }),
      },
      ...additionalDecorators,
    ],
    getAccessibilityProps: () => (
      {
        role: 'combobox',
        ariaAutoComplete: 'list',
        ariaHasPopup: ariaProps.ariaHasPopup,
        ariaExpanded: ariaProps.ariaExpanded,
        ariaActiveDescendantID: ariaProps.ariaActiveDescendantID,
        ariaOwneeID: ariaProps.ariaOwneeID,
      }
    ),

    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    onDownArrow: event => callbacks.onDownArrow && callbacks.onDownArrow(event),
    onTab: event => callbacks.onTab && callbacks.onTab(event),
    onUpArrow: event => callbacks.onUpArrow && callbacks.onUpArrow(event),
    onEscape: event => callbacks.onEscape && callbacks.onEscape(event),
    handleReturn: event => callbacks.handleReturn && callbacks.handleReturn(event),
    onChange: editorState => {
      if (callbacks.onChange) {
        return callbacks.onChange(editorState);
      }
      return editorState;
    }
  };
};

export default createCompletionPlugin;

export { getSearchText };

export const defaultSuggestionsFilter = suggestionsFilter;