/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference path="../../../types.ts" />

import type {
  IQuickInputToggle,
  IQuickPick,
  IQuickPickItem,
  QuickPickInput,
  IQuickInputService,
} from '../../quickInputService';

// @ts-ignore
import { DisposableStore } from 'monaco-editor/esm/vs/base/common/lifecycle';
import * as monaco from 'monaco-editor';

interface InstalledThemesPickerOptions {
  readonly placeholderMessage: string;
  readonly title?: string;
  readonly description?: string;
  readonly toggles?: IQuickInputToggle[];
  readonly onToggle?: (
    toggle: IQuickInputToggle,
    quickInput: IQuickPick<ThemeItem>
  ) => Promise<void>;
}

export type Pick = QuickPickInput<ThemeItem>;

function isItem(i: QuickPickInput<ThemeItem>): i is ThemeItem {
  return (<any>i)['type'] !== 'separator';
}

export class InstalledThemesPicker {
  constructor(
    private readonly options: InstalledThemesPickerOptions,
    private readonly quickInputService: IQuickInputService
  ) {}

  public async openQuickPick(picks: Pick[], currentTheme: string) {
    let selectThemeTimeout: number | undefined;

    const selectTheme = (theme: string | undefined, applyTheme: boolean) => {
      if (selectThemeTimeout) {
        clearTimeout(selectThemeTimeout);
      }
      selectThemeTimeout = window.setTimeout(
        () => {
          selectThemeTimeout = undefined;
          console.log(theme);
          monaco.editor.setTheme(theme || currentTheme);
        },
        applyTheme ? 0 : 200
      );
    };

    const pickInstalledThemes = (activeItemId: string | undefined) => {
      return new Promise<void>((resolve, _) => {
        let isCompleted = false;
        const disposables = new DisposableStore();

        const autoFocusIndex = picks.findIndex(
          (p) => isItem(p) && p.id === activeItemId
        );
        const quickpick = this.quickInputService.createQuickPick<ThemeItem>();
        quickpick.items = picks;
        quickpick.title = this.options.title;
        quickpick.description = this.options.description;
        quickpick.placeholder = this.options.placeholderMessage;
        quickpick.activeItems = [picks[autoFocusIndex] as ThemeItem];
        quickpick.canSelectMany = false;
        quickpick.toggles = this.options.toggles;
        quickpick.toggles?.forEach((toggle) => {
          toggle.onChange(
            () => this.options.onToggle?.(toggle, quickpick),
            undefined
          );
        });
        quickpick.matchOnDescription = true;
        quickpick.onDidAccept(async (_: any) => {
          isCompleted = true;
          const theme = quickpick.selectedItems[0];

          selectTheme(theme.theme, true);

          quickpick.hide();
          resolve();
        });
        quickpick.onDidChangeActive((themes) => {
          selectTheme(themes[0]?.theme, false);
        });
        quickpick.onDidHide(() => {
          if (!isCompleted) {
            selectTheme(currentTheme, true);
            resolve();
          }
          quickpick.dispose();
          disposables.dispose();
        });
        quickpick.show();
      });
    };
    await pickInstalledThemes(currentTheme);
  }
}
interface ThemeItem extends IQuickPickItem {
  readonly id: string | undefined;
  readonly theme?: string;
  readonly label: string;
  readonly description?: string;
  readonly alwaysShow?: boolean;
}
