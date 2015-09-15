'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

export default class TabBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleFileSelector() {
    this.props.onFileSelectorToggle();
    this.setState({ isOpen: !this.state.isOpen });
  }

  renderSaveMessage() {
    if (this.props.saved) {
      return (
        <span className="editor-tab-bar__flash-message">
          Saved
        </span>
      );
    }
  }

  render() {
    const {
      onFileSelectorToggle,
      currentFile,
      unsavedChanges
    } = this.props;

    const { isOpen } = this.state;

    var buttonClasses = classNames({
      'editor-tab-bar__tab__button': true,
      'editor-tab-bar__tab__button--wide': isOpen,
    });

    const iconClasses = classNames({
      'fa': true,
      'editor-tab-bar__icon': true,
      'fa-folder': !isOpen,
      'fa-folder-open': isOpen,
    });

    const saveIndicatorClasses = classNames({
      'editor-tab-bar__tab__circle': unsavedChanges
    });

    return (
      <div className="editor-header__bar editor-tab-bar">
        <span className={buttonClasses} ref="toggleFileSelector" onClick={this.toggleFileSelector.bind(this)}>
          <i className={iconClasses}></i>
          <span className="editor-tab-bar__text">Files</span>
          <i className="fa fa-angle-right editor-tab-bar__icon--right"></i>
        </span>
        <span className="editor-tab-bar__tab">
          {currentFile}
          <div className={saveIndicatorClasses}></div>
        </span>
        {this.renderSaveMessage()}
      </div>
    );
  }
}
