// https://github.com/Microsoft/monaco-editor/issues/683#issuecomment-1132937364

import * as monaco from 'monaco-editor';
// @ts-ignore no typings are available
import { IQuickInputService } from 'monaco-editor/esm/vs/platform/quickinput/common/quickInput';
// @ts-ignore no typings are available
import { IDialogService } from 'monaco-editor/esm/vs/platform/dialogs/common/dialogs';

// Import themes
import monospace_dark from './dark/monospace-dark.json';
import dark_plus from './dark/default-dark.json';
import vs_dark from './dark/vs-dark.json';
import dark_modern from './dark/dark-modern.json';

// Light themes
import vs_light from './light/vs.json';
import light_plus from './light/light-plus.json';
import monospace_light from './light/monospace-light.json';
import light_modern from './light/light-modern.json';
import monokai from './dark/monokai.json';

// End import themes
import { IVScodeTheme } from './theme';

import { showErrorMessage } from '../../../toast/toast.main';
import convertTheme from './theme-converter';
interface Theme {
  id: string;
  data: IVScodeTheme;
  name: string;
}

let themes: Theme[] = [
  { id: 'vs', data: vs_light, name: 'Light (Visual Studio)' },
  { id: 'light-plus', data: light_plus, name: 'Light+' },
  { id: 'light-modern', data: light_modern, name: 'Light Modern' },
  { id: 'monospace-light', data: monospace_light, name: 'Monospace Light' },
  { id: 'vs-dark', data: vs_dark, name: 'Dark (Visual Studio)' },
  { id: 'dark-plus', data: dark_plus, name: 'Dark+' },
  { id: 'dark-modern', data: dark_modern, name: 'Dark Modern' },
  { id: 'monokai', data: monokai, name: 'Monokai' },
  { id: 'monospace-dark', data: monospace_dark, name: 'Monospace Dark' },
];

const userThemes = JSON.parse(
  (localStorage.getItem('userThemes') || '{}').replace(/\/\/.*/g, '')
);
Object.entries<any>(userThemes).forEach(
  ([id, { data, name }]: [string, Theme]) => {
    themes.push({ id, data, name });
  }
);

interface Selection {
  type: 'item' | 'separator';
  id: string;
  label: string;
}

export default function createThemeSelector(
  editor: monaco.editor.IStandaloneCodeEditor & { _themeService: any }
) {
  themes.forEach(({ id, data }) =>
    monaco.editor.defineTheme(id, convertTheme(data))
  );

  monaco.editor.setTheme('dark-modern');

  // Add a new command, for getting an accessor.
  let quickInputCommand = editor.addCommand(0, (accessor, func) => {
    // a hacker way to get the input service
    let quickInputService = accessor.get(IQuickInputService);
    func(quickInputService);
  })!;
  // editor.trigger('', quickInputCommand, (quickinput: any) => {
  //   console.log(quickinput.createQuickPick().show());
  // });

  editor.addAction({
    id: 'change-color-theme',
    label: 'Change Color Theme',
    run: (editor) => {
      // create quick input
      editor.trigger('', quickInputCommand, (quickInput: any) => {
        const lightThemes = themes.filter(
          (theme) => theme.data.type === 'light'
        );

        const darkThemes = themes.filter((theme) => theme.data.type === 'dark');
        quickInput
          .pick([
            { type: 'separator', label: 'light themes' },
            ...lightThemes.map<Selection>(({ name, id }) => ({
              label: name,
              id,
              type: 'item',
            })),
            { type: 'separator', label: 'dark themes' },
            ...darkThemes.map<Selection>(({ name, id }) => ({
              label: name,
              id,
              type: 'item',
            })),
          ])
          .then((result: Selection | undefined) => {
            if (!result) return {};
            // @ts-expect-error
            const themes = editor._themeService._knownThemes as Map<
              string,
              any
            >;
            if (!themes.has(result.id)) {
              showErrorMessage("Cannot find theme '" + result.id + "'.");
              return;
            }

            try {
              monaco.editor.setTheme(result.id);
            } catch (e) {
              showErrorMessage(`Unexpected error when changing theme: ${e}`);
            }
          });
      });
    },
  });
}
