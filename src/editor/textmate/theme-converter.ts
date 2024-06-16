import darkPlusTheme from './theme';
import type { IVScodeTheme } from './theme';

import type { editor } from 'monaco-editor';

export function convertTheme(theme: IVScodeTheme): editor.IStandaloneThemeData {
  const rules = [];
  for (const rule of theme.tokenColors) {
    if (typeof rule.scope === 'string') {
      rules.push({
        token: rule.scope,
        foreground: rule.settings.foreground,
      });
    } else {
      for (const scope of rule.scope) {
        rules.push({
          token: scope,
          foreground: rule.settings.foreground,
        });
      }
    }
  }

  return {
    base: theme.type === 'dark' ? 'vs-dark' : 'vs',
    inherit: false,
    rules,
    colors: theme.colors || {},
  };
}

export { darkPlusTheme, convertTheme as default };