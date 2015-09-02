'use strict';

import React from 'react';
import CodeMirror from 'codemirror';
import assign from 'lodash/object/assign';

import EditorHeader from './EditorHeader';
import FileSelector from './FileSelector';
import TabBar from './TabBar';
import Logger from './Logger';


const DEFAULT_CODEMIRROR_OPTIONS = {
  autofocus: true,
  indentUnit: 2,
  indentWithTabs: false,
  lineNumbers: true,
  lineWrapping: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
  mode: 'javascript',
  tabSize: 2,
  theme: 'solarized',
};

export default class Editor {

  static propTypes = {
    onChangeFile: React.PropTypes.func.isRequired,
    onUpdateBody: React.PropTypes.func.isRequired
  }

  constructor({ app : { files } }, context) {
    this._codeMirrorInstance = null;
    this._codeMirrorDocuments = null;
  }

  handleEditorChange = (codeMirror) => {
    this.props.onUpdateBody(codeMirror.getValue());
  }

  componentDidMount() {
    const {
      useDarkTheme,
      useVimKeyBindings,
      app : { files },
      onChangeFile,
      currentFile
    } = this.props;

    const options = assign({}, DEFAULT_CODEMIRROR_OPTIONS, {
      theme: useDarkTheme ? 'midnight' : 'solarized',
    }, useVimKeyBindings ? {keyMap: 'vim'} : {});

    const textareaNode = React.findDOMNode(this.refs.editorTextArea);
    const textArea = CodeMirror.fromTextArea(textareaNode, options);
    textArea.on('change', this.handleEditorChange);

    const documents = Object.keys(files)
      .reduce((docs, filename) => {
        docs[filename] = new CodeMirror.Doc(files[filename], 'javascript');
        return docs;
      }, {});

    this._codeMirrorInstance = textArea;
    this._codeMirrorDocuments = documents;

    // load the index page first
    textArea.swapDoc(documents[currentFile]);
  }

  changeFile = (filename) => {
    this._codeMirrorInstance.swapDoc(this._codeMirrorDocuments[filename]);
    this.props.onChangeFile(filename);
  }

  render() {
    const {
      app: { body },
      currentFile,
      fileTree,
      fileSelectorOpen,
      onFileSelectorToggle,
      useDarkTheme,
      logs,
      editorHeaderProps
    } = this.props;

    const tabBarProps = {
      currentFile,
      onFileSelectorToggle,
      useDarkTheme
    };

    return (
      <div className="editor-container">

        <EditorHeader {...editorHeaderProps} />
        <TabBar {...tabBarProps} />

        <div className="editor-wrap">
          <FileSelector
            open={fileSelectorOpen}
            files={fileTree}
            current={currentFile}
            onSelect={this.changeFile}
          />
          <div className="editor">
            <textarea
              ref="editorTextArea"
              onChange={this._onChange}
              defaultValue={body}
            />
          </div>
        </div>

        <Logger logs={logs} />

      </div>
    );
  }
}
