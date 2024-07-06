import './style.css';
import './layout/colors.css';
import './jetbrains-mono.css';
import './editor/workers';

import * as monaco from 'monaco-editor';

import { editor, html, css, ts } from './editor/editor.main';
import initThemeSelector from './editor/textmate/themes/theme-selector';
import './layout/tab-functionality';
import { updatePreview } from './preview';
import { showErrorMessage } from './toast/toast.main';
import { Project, openProject, saveProject } from './localDevice';
import './layout/sidebar';
import './layout/splitview';

let currentProject: Project | undefined = undefined;

initThemeSelector(editor);
editor.addAction({
  label: 'Run code',
  id: 'run-code',
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
  run() {
    updatePreview();
  },
});

editor.addAction({
  label: 'Save code',
  id: 'save-code',
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
  run() {
    updatePreview();
    saveProject(
      currentProject || {
        name: 'project',
        htmlContent: html.getValue(),
        cssContent: css.getValue(),
        jsContent: ts.getValue(),
      }
    ).catch((e) => showErrorMessage(e.message));
  },
});

editor.addAction({
  label: 'open project',
  id: 'open-project',
  keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyO],
  run() {
    openProject()
      .then((project) => {
        html.setValue(project.htmlContent);
        css.setValue(project.cssContent);
        ts.setValue(project.jsContent);
        currentProject = project;
      })
      .catch((e) => showErrorMessage(e.message));
  },
});
