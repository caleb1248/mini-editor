export interface IVScodeTheme {
  $schema: 'vscode://schemas/color-theme';
  name?: string | undefined;
  include?: string | undefined;
  type: 'dark' | 'light';
  tokenColors: TokenColor[];
  colors?:
    | {
        [name: string]: string;
      }
    | undefined;
}

export interface TokenColor {
  name?: string;
  scope: string[];
  settings: {
    foreground: string;
  };
}

export { default } from './themes/monospace-dark.json';
// export default {
//   $schema: 'vscode://schemas/color-theme',
//   type: 'dark',
//   colors: {
//     'editor.background': '#1E1E1E',
//     'editor.foreground': '#D4D4D4',
//   },
//   tokenColors: [],
// } as IVScodeTheme;
