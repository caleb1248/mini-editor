import * as monaco from 'monaco-editor';

const previewIframe = document.createElement('iframe');
previewIframe.title = 'Preview';
previewIframe.classList.add('preview');

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

let html = htmlModel.getValue();
let css = cssModel.getValue();
let js = jsModel.getValue();

let updateTimeout: number | undefined = undefined;

const updatePreview = () => {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    document.querySelector('#preview-note')?.remove();
    // console.clear();
    previewIframe.srcdoc = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <style>
      ${css}
    </style>
  </head>
  <body>
    ${html}
    <script>
      ${js}
    </script>
  </body>
</html>
  `;
  }, 300);
};

updatePreview();

htmlModel.onDidChangeContent(() => {
  html = htmlModel.getValue();
  updatePreview();
});

cssModel.onDidChangeContent(() => {
  css = cssModel.getValue();
  updatePreview();
});

jsModel.onDidChangeContent(() => {
  js = jsModel.getValue();
  updatePreview();
});
