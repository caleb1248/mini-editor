import { format } from "./prettier";
import * as typescript from "prettier/parser-typescript";
import estree from "prettier/plugins/estree";
import * as monaco from "monaco-editor";

monaco.languages.registerDocumentFormattingEditProvider("typescript", {
  async provideDocumentFormattingEdits(model) {
    const text = model.getValue();
    console.log("formatting...", text);
    const formatted = format(text, {
      filepath: model.uri.path,
      plugins: [typescript, estree],
    });
    console.log("EEEEE");
    return [
      {
        range: model.getFullModelRange(),
        text: await formatted,
      },
    ];
  },
});
