import { showErrorMessage as throwError } from './toast/toast.main';

const configuration: IProjectConfiguration = {
  name: '',
  description: '',
  scripts: [],
  stylesheets: [],
};

interface IProjectConfiguration {
  name: string;
  description: string;
  scripts: string[];
  stylesheets: string[];
}

export function getProjectConfiguration(): IProjectConfiguration {
  return configuration;
}

export function setProjectName(name: string) {
  configuration.name = typeof name === 'string' ? name : '';
}

export function setProjectDescription(description: string) {
  configuration.description =
    typeof description === 'string' ? description : '';
}

export function addScript(scriptURL: string) {
  if (typeof scriptURL === 'string' && URL.canParse(scriptURL)) {
    configuration.scripts.push(scriptURL);
  } else {
    throwError(
      "Could not add script URL '" +
        scriptURL +
        "': The script URL must be a valid URL string"
    );
  }
}

export function addStylesheet(stylesheetURL: string) {
  if (typeof stylesheetURL === 'string' && URL.canParse(stylesheetURL)) {
    configuration.stylesheets.push(stylesheetURL);
  } else {
    throwError(
      'Invalid configuration: Project stylesheet must be a valid URL string'
    );
  }
}

export function setProjectConfiguration(config: IProjectConfiguration) {
  // Runtime type check config BEFORE setting it
  if (typeof config.name === 'string') {
    configuration.name = config.name;
  } else {
    throwError('Invalid configuration: Project name must be a string');
  }

  if (typeof config.description === 'string') {
    configuration.description = config.description;
  } else {
    throwError('Invalid configuration: Project description must be a string');
  }

  if (Array.isArray(config.scripts)) {
    for (const script of config.scripts) {
      if (typeof script !== 'string' || !URL.canParse(script)) {
        throwError(`Could not parse script URL '${script}'`);
      }
    }
  } else {
    throwError(
      'Invalid configuration: Project scripts must be an array of valid URL strings'
    );
  }

  if (Array.isArray(config.stylesheets)) {
    for (const stylesheet of config.stylesheets) {
      if (typeof stylesheet !== 'string' || !URL.canParse(stylesheet)) {
        throwError(`Could not parse stylesheet URL '${stylesheet}'`);
      }
    }
  } else {
    throwError(
      'Invalid configuration: Project stylesheets must be an array of valid URL strings'
    );
  }
}
