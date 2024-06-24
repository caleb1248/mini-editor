import type { IVScodeTheme } from './theme';

import type { editor } from 'monaco-editor';

export function convertTheme(theme: IVScodeTheme): editor.IStandaloneThemeData {
  const rules: editor.ITokenThemeRule[] = [];
  for (const rule of theme.tokenColors) {
    if (typeof rule.scope === 'string') {
      rules.push({
        token: rule.scope,
        foreground: rule.settings.foreground,
        background: rule.settings.background,
        fontStyle: rule.settings.fontStyle,
      });
    } else {
      for (const scope of rule.scope) {
        rules.push({
          token: scope,
          foreground: rule.settings.foreground,
          background: rule.settings.background,
          fontStyle: rule.settings.fontStyle,
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

export { convertTheme as default };
