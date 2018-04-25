import React from 'react';

export default class CompletionSuggestionsPortal extends React.Component {
  searchPortalRef = React.createRef();

  componentDidMount() {
    const {store, offsetKey, getEditorState, setEditorState} = this.props;
    store.register(offsetKey);
    this.updatePortalClientRect();
    setEditorState(getEditorState());
  }

  componentDidUpdate() {
    this.updatePortalClientRect();
  }

  componentWillUnmount() {
    const {store} = this.props;
    store.unregister(this.props.offsetKey);
  }

  updatePortalClientRect(props) {
    const {store, offsetKey} = this.props;
    store.updatePortalClientRect(offsetKey, () =>
      this.searchPortalRef.current.getBoundingClientRect(),
    );
  }

  render() {
    const {children} = this.props;
    return (
      <span
        data-randomshit="lol"
        className={this.key}
        ref={this.searchPortalRef}>
        {children}
      </span>
    );
  }
}
