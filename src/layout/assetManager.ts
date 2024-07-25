import { getScripts, getStylesheets } from '../settingsService';
import { FindInput } from 'monaco-editor/esm/vs/base/browser/ui/findInput/findInput';

function applyStyles(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
) {
  for (const key in styles) {
    if (styles[key]) element.style[key] = styles[key];
  }
}

const createCodicon = (name: string) => {
  const icon = document.createElement('i');
  icon.classList.add('codicon', `codicon-${name}`);
  return icon;
};

const { scriptList, stylesheetList, load } = (() => {
  const scriptList = document.createElement('ul');
  scriptList.classList.add('sidebar-list');

  const stylesheetList = document.createElement('ul');
  stylesheetList.classList.add('sidebar-list');

  function load() {
    // Populate scripts list from current project configuration
    getScripts().forEach((scriptURL) => {
      const listItem = document.createElement('li');
      listItem.textContent = scriptURL;
      listItem.appendChild(createCodicon('trash'));
      scriptList.appendChild(listItem);
    });

    // Populate stylesheet list from current project configuration
    getStylesheets().forEach((stylesheetURL) => {
      const listItem = document.createElement('li');
      listItem.textContent = stylesheetURL;
      listItem.appendChild(createCodicon('trash'));
      stylesheetList.appendChild(listItem);
    });
    const addStylesheetUi = document.createElement('li');
    addStylesheetUi.addEventListener('focus', () => {
      addStylesheetUi.classList.add('synthetic-focus');
    });

    const input = new FindInput(addStylesheetUi, undefined, {
      label: 'yourmom',
      inputBoxStyles: {},
      toggleStyles: {},
      showCommonFindToggles: true,
    });

    stylesheetList.appendChild(addStylesheetUi);
  }
  load();
  return { scriptList, stylesheetList, load };
})();
export { scriptList, stylesheetList, load };
