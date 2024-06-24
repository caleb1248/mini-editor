export interface IVScodeTheme {
  $schema: 'vscode://schemas/color-theme' | string;
  name?: string | undefined;
  include?: string | undefined;
  type: 'dark' | 'light' | string;
  tokenColors: TokenColor[];
  colors?:
    | {
        [name: string]: string;
      }
    | undefined;
}

export interface TokenColor {
  name?: string;
  scope: string[] | string;
  settings: {
    background?: string;
    foreground?: string;
    fontStyle?: string;
  };
}
// export default {
//   $schema: 'vscode://schemas/color-theme',
//   type: 'dark',
//   colors: {
//     'editor.background': '#1E1E1E',
//     'editor.foreground': '#D4D4D4',
//   },
//   tokenColors: [],
// } as IVScodeTheme;
