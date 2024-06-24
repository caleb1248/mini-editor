import defaultDarkColors from './textmate/themes/color-defaults/dark.json';
import defaultLightColors from './textmate/themes/color-defaults/light.json';

const defaultColors = {
  light: defaultLightColors as Record<string, string | null>,
  dark: defaultDarkColors as Record<string, string | null>,
};

export default defaultColors;
