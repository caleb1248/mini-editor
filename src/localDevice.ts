// The user should be able to save a project to the local device as a file.

import { IProjectConfiguration } from './settingsService';

interface Project {
  name?: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  configuration: IProjectConfiguration;
  fileHandle?: FileSystemFileHandle;
}

function convertProjectToJson(project: Project): string {
  // only include name and content
  return JSON.stringify({
    name: project.name,
    htmlContent: project.htmlContent,
    cssContent: project.cssContent,
    jsContent: project.jsContent,
  });
}

async function openProject() {
  // Open a file picker
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  const project = JSON.parse(contents);

  // Check if the project is valid
  if (!checkProject(project)) {
    throw new Error('The file is not a project');
  }
  project.fileHandle = fileHandle;
  return project;
}

async function saveProject(project: Project) {
  if (!checkProject(project)) {
    throw new Error('Project is not valid');
  }
  if (project.fileHandle) {
    const writable = await project.fileHandle.createWritable();
    await writable.write(convertProjectToJson(project));
    await writable.close();
  } else {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: 'project.miniproject',
    });
    project.fileHandle = fileHandle;
    const writable = await fileHandle.createWritable();
    await writable.write(convertProjectToJson(project));
    await writable.close();
  }
}

function checkProject(project: Project): project is Project {
  if (!project.htmlContent || !project.cssContent || !project.jsContent) {
    return false;
  }
  return true;
}

export { type Project, openProject, saveProject };
