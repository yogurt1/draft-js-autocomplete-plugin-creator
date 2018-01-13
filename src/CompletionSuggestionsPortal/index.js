import * as React from "react";

export default class CompletionSuggestionsPortal extends React.Component {
  searchPortal = null;
  searchPortalRef = ref => {
    this.searchPortal = ref;
  };

  componentDidMount() {
    const { store } = this.props;
    store.register(this.props.offsetKey);
    this.updatePortalClientRect(this.props);
    this.props.setEditorState(this.props.getEditorState());
  }

  componentWillReceiveProps(nextProps) {
    this.updatePortalClientRect(nextProps);
  }

  componentWillUnmount() {
    const { store } = this.props;
    store.unregister(this.props.offsetKey);
  }

  updatePortalClientRect(props) {
    this.props.store.updatePortalClientRect(props.offsetKey, () =>
      this.searchPortal.getBoundingClientRect()
    );
  }

  render() {
    return (
      <span className={this.key} ref={this.searchPortalRef}>
        {this.props.children}
      </span>
    );
  }
}
