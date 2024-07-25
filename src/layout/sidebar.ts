import {
  getProjectConfiguration,
  setProjectDescription,
  setProjectName,
} from '../settingsService';

import {
  scriptList,
  stylesheetList,
  load as loadAssetManager,
} from './assetManager';

const sidebarElement = document.getElementById('sidebar')!;

/*
  ## Project Metadata

  Name:
  +-------------------+
  |Project name...    |
  +-------------------+

  Description:
  +-------------------+
  |Project description|
  +-------------------+

  ## Settings

  Scripts:

  // List of urls

  Stylesheets:

  // List of urls
*/

function h1(
  text: string,
  optionalStyles?: Partial<CSSStyleDeclaration> | undefined
) {
  const h1 = document.createElement('h1');
  h1.textContent = text;

  if (optionalStyles) {
    for (const key in optionalStyles) {
      if (optionalStyles[key]) h1.style[key] = optionalStyles[key];
    }
  }
  return h1;
}

function h2(text: string) {
  const h2 = document.createElement('h2');
  h2.textContent = text;
  return h2;
}

//@ts-expect-error
function p(text: string) {
  const p = document.createElement('p');
  p.textContent = text;
  return p;
}

function createInput() {
  const input = document.createElement('input');
  input.classList.add('minieditor-inputbox');
  input.style.marginBottom = '10px';
  return input;
}

function horizontalDivider() {
  const divider = document.createElement('div');
  divider.classList.add('horizontal-divider');
  return divider;
}

const projectName = createInput();
projectName.placeholder = 'Project name...';
projectName.value = getProjectConfiguration().name;
projectName.addEventListener('input', () => setProjectName(projectName.value));

const projectDescription = document.createElement('textarea');
projectDescription.classList.add('minieditor-inputbox');
projectDescription.style.marginBottom = '10px';
projectDescription.style.resize = 'none';

projectDescription.placeholder = 'Project description...';
projectDescription.value = getProjectConfiguration().description;
projectDescription.addEventListener('input', () =>
  setProjectDescription(projectDescription.value)
);

sidebarElement.replaceChildren(
  h1('Project Metadata', { marginBottom: '1rem' }),
  projectName,
  projectDescription,
  horizontalDivider(),
  h1('Resources', { marginTop: '0.7rem', marginBottom: '1rem' }),
  h2('Scripts'),
  scriptList,
  h2('Stylesheets'),
  stylesheetList
);

function loadSidebar() {
  projectName.value = getProjectConfiguration().name;
  projectDescription.value = getProjectConfiguration().description;
  loadAssetManager();
}

export { loadSidebar };
