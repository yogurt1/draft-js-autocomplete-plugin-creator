import * as React from "react";

export default class CompletionSuggestionsPortal extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    store.register(this.props.offsetKey);
    store.setIsOpened(true);
    this.updatePortalClientRect(this.props);
    this.props.setEditorState(this.props.getEditorState());
  }

  componentWillReceiveProps(nextProps) {
    this.updatePortalClientRect(nextProps);
  }

  componentWillUnmount() {
    const { store } = this.props;
    store.unregister(this.props.offsetKey);
    store.setIsOpened(false);
  }

  updatePortalClientRect(props) {
    this.props.store.updatePortalClientRect(props.offsetKey, () =>
      this.refs.searchPortal.getBoundingClientRect()
    );
  }

  render() {
    return (
      <span className={this.key} ref="searchPortal">
        {this.props.children}
      </span>
    );
  }
}
