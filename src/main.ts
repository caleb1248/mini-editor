import './style.css';
import './jetbrains-mono.css';
import './editor/workers';
import { editor } from './editor/editor.main';
import initThemeSelector from './editor/textmate/themes/theme-selector';
import './layout/styles';
import './preview';

import { showInformationMessage } from './toast/toast.main';

showInformationMessage(
  'Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!Hello, world!'
);

initThemeSelector(editor);
