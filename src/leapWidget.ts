import {
  window,
  QuickPick,
  QuickPickItem,
  QuickInputButton,
  ThemeIcon,
  Range,
  ExtensionContext,
  Selection,
} from "vscode";
import { SearchDirection } from "./extension";
import { findFirstChar, findLabel, findSecond, PotentialMatch } from "./find";

const MATCH_CASE_KEY = "match-case";

export class LeapWidget {
  public isActive = true;

  private direction: SearchDirection;
  private searchString = "";
  private matches: Map<string, PotentialMatch[]> = new Map();

  private readonly quickPick: QuickPick<QuickPickItem> =
    window.createQuickPick();
  private quickInputButtons: Map<QuickInputButton, () => void> = new Map();

  constructor(private readonly context: ExtensionContext) {
    this.quickPick.title = "Leap Finder";
    this.quickPick.placeholder = "Find";

    this.direction = "forwards";

    this.quickPick.onDidTriggerButton(this.onDidTriggerButton.bind(this));
    this.quickPick.onDidChangeValue(this.onChangeValue.bind(this));
    this.quickPick.onDidHide(this.hide.bind(this));
  }

  public setSearchDirection(direction: SearchDirection) {
    this.direction = direction;
  }

  public show(): void {
    if (!this.isActive) {
      console.error("show: Leapwidget has already been disposed!");
      return;
    }
    this.quickPick.value = "";
    this.quickPick.show();
  }

  public close(): void {
    this.hide();
    this.quickPick.dispose();
    this.isActive = false;
  }

  private createSearch() {
    const editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    this.matches = findFirstChar(
      this.searchString.toLowerCase(),
      this.direction,
      editor,
    );
  }

  private searchSecond() {
    findSecond(this.searchString.charAt(1).toLowerCase(), this.matches);
  }

  private searchLabel() {
    const editor = window.activeTextEditor;
    if (!editor) {
      this.close();
      return;
    }

    const result = findLabel(
      this.searchString.slice(0, 2).toLowerCase(),
      this.searchString.charAt(2),
      this.matches,
    );
    if (!result) {
      this.close();
      return;
    }
    editor.selections = [new Selection(result.range.start, result.range.start)];
    this.close();
  }

  private hide(): void {
    if (!this.isActive) {
      console.error("hide: Leapwidget has already been disposed!");
      return;
    }
    this.disposeDecorations();
  }

  private disposeDecorations(): void {
    for (let [_target, tagetMatches] of this.matches) {
      for (let match of tagetMatches) {
        if (match.active) {
          match.active = false;
          match.decoretor?.dispose();
        }
      }
    }
    this.matches = new Map();
  }

  private onChangeValue(value: string): void {
    this.searchString = value;
    if (value.length === 0) {
      this.disposeDecorations();
    } else if (value.length === 1) {
      this.disposeDecorations();
      this.createSearch();
    } else if (value.length === 2) {
      this.searchSecond();
    } else if (value.length === 3) {
      this.searchLabel();
    }
  }

  private onDidTriggerButton(button: QuickInputButton): void {
    this.quickInputButtons.get(button)?.();
  }
}
