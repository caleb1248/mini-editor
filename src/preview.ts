import * as monaco from 'monaco-editor';
import { transformCode } from './ts-support';

import { initialize } from 'esbuild-wasm';
import esbuildWasmURL from 'esbuild-wasm/esbuild.wasm?url';
import type * as esbuild from 'esbuild-wasm';

await initialize({
  wasmURL: esbuildWasmURL,
});

const previewIframe = document.createElement('iframe') as HTMLIFrameElement & {
  credentialless: boolean;
  /**
   * @deprecated
   */
  allowPaymentRequest: boolean;
};
previewIframe.title = 'Preview';
previewIframe.credentialless = true;
previewIframe.classList.add('preview');
previewIframe.allow =
  'midi; geolocation; microphone; camera; display-capture; encrypted-media; clipboard-read; clipboard-write; notifications; payment-handler; persistent-storage; background-sync; ambient-light-sensor; accessibility-events;';

previewIframe.sandbox.value =
  'allow-modals allow-forms allow-scripts allow-popups allow-top-navigation-by-user-activation allow-downloads';
previewIframe.allowFullscreen = true;
previewIframe.allowPaymentRequest = true;
previewIframe.frameBorder = '0';

document.getElementById('preview-part')?.appendChild(previewIframe);

let htmlModel = monaco.editor.getModel(monaco.Uri.file('/index.html'))!;

if (!htmlModel) {
  await new Promise<void>((resolve) => {
    monaco.editor.onDidCreateModel((model) => {
      if (model.uri.path === '/index.html') {
        htmlModel = model;
        resolve();
      }
    });
  });
}
let cssModel = monaco.editor.getModel(monaco.Uri.file('/style.css'))!;

if (!cssModel) {
  await new Promise<void>((resolve) => {
    monaco.editor.onDidCreateModel((model) => {
      console.log(model.uri.path);
      if (model.uri.path === '/style.css') {
        cssModel = model;
        resolve();
      }
    });
  });
}
let jsModel = monaco.editor.getModel(monaco.Uri.file('/main.ts'))!;

if (!jsModel) {
  await new Promise<void>((resolve) => {
    monaco.editor.onDidCreateModel((model) => {
      if (model.uri.path === '/main.ts') {
        jsModel = model;
        resolve();
      }
    });
  });
}

let htmlContent = htmlModel.getValue();
let cssContent = cssModel.getValue();
let jsContent = jsModel.getValue();

let updateTimeout: number | undefined = undefined;

export const updatePreview = () => {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(async () => {
    document.querySelector('#preview-note')?.remove();
    transformCode(jsContent, 'ts')
      .then((compilerResult) => {
        const compiledJS = compilerResult.code;
        previewIframe.srcdoc = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <!--<script>window.parent = null; window.top = null; window.frameElement = null;</script>-->
    <style>
      ${cssContent}
    </style>
  </head>
  <body>
    ${htmlContent}
    <script>
      ${compiledJS}
    </script>
  </body>
</html>
  `;
      })
      .catch((e: esbuild.TransformFailure) => {
        previewIframe.srcdoc = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Preview</title>
    <!--<script>window.parent = null; window.top = null; window.frameElement = null;</script>-->
    <style>
      ${cssContent}
    </style>

    <!--Error modal styles-->
    <style>
      #error-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: 30px auto;
        padding: 20px;
        border-radius: 5px;
        border-top: 5px solid #f44336;
        background: rgba(0, 0, 0, 0.95);
        width: 80vw;
        font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
      }

      #error-modal * {
        color: #fff;
      }

      #error-modal h1, #error-modal h2 {
        font-weight: 200;
        margin-bottom: 0;
      }
    </style>
  </head>
  <body>
    ${htmlContent}
    <div id="error-modal">
      <h1>Error</h1>
      <h2>${e.message}</p>
    </div>
    <script></script>
  </body>
</html>`;
      });
  }, 300);
};

updatePreview();

htmlModel.onDidChangeContent(() => {
  htmlContent = htmlModel.getValue();
  // updatePreview();
});

cssModel.onDidChangeContent(() => {
  cssContent = cssModel.getValue();
  // updatePreview();
});

jsModel.onDidChangeContent(() => {
  jsContent = jsModel.getValue();
  // updatePreview();
});
