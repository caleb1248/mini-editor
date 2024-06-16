import prettier from 'prettier';
import * as ts from 'prettier/parser-typescript';
import * as babel from 'prettier/parser-babel';
import * as html from 'prettier/parser-html';
import * as css from 'prettier/parser-postcss';
import * as estree from 'prettier/plugins/estree';

export function formatTS(code: string) {
  return prettier.format(code, {
    parser: 'typescript',
    plugins: [ts, estree],
  });
}

export function formatHTML(code: string) {
  return prettier.format(code, {
    parser: 'html',
    plugins: [html],
  });
}

export function formatCSS(code: string) {
  return prettier.format(code, {
    parser: 'css',
    plugins: [css],
  });
}

export function formatJS(code: string) {
  return prettier.format(code, {
    parser: 'babel',
    plugins: [babel, estree],
  });
}
