import {
  getProjectConfiguration,
  setProjectDescription,
  setProjectName,
} from '../settingsService';

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

function h1(text: string) {
  const h1 = document.createElement('h1');
  h1.textContent = text;
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
  input.classList.add('sidebar-input');
  return input;
}

const projectName = createInput();
projectName.placeholder = 'Project name...';
projectName.value = getProjectConfiguration().name;
projectName.addEventListener('input', () => setProjectName(projectName.value));

const projectDescription = createInput();
projectDescription.placeholder = 'Project description...';
projectDescription.value = getProjectConfiguration().description;
projectDescription.addEventListener('input', () =>
  setProjectDescription(projectDescription.value)
);

sidebarElement.replaceChildren(
  h1('Project Metadata'),
  h2('Name'),
  projectName,
  h2('Description'),
  projectDescription,
  h1('Settings')
);
