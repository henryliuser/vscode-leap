import { commands, ExtensionContext, workspace } from "vscode";
import { LeapWidget } from "./leapWidget";

export type SearchDirection = "backwards" | "forwards" | "both";

let widget: LeapWidget | undefined;

function getWidgetInstance(context: ExtensionContext): LeapWidget {
  if (!widget || !widget.isActive) {
    widget = new LeapWidget(context);
  }
  return widget;
}

export interface ExtensionSettings {
  /* determines if <space><space> should only match the new Line symbol like in leap.nvim */
  whiteSpacesOnlyMatchNewLine: boolean;
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    ...[
      commands.registerCommand("leap.find-forwards", async () => {
        const workspaceConfig = workspace.getConfiguration("leap");

        widget = getWidgetInstance(context);
        widget.setSearchDirection("forwards");
        widget.show();
      }),
      commands.registerCommand("leap.find-backwards", async () => {
        const workspaceConfig = workspace.getConfiguration("leap");

        widget = getWidgetInstance(context);
        widget.setSearchDirection("backwards");
        widget.show();
      }),
      commands.registerCommand("leap.match-case", async () => {
        if (widget && widget.isActive) {
          widget.toggleMatchCase();
        }
      }),
    ],
  );
}

function getSetting<Type>(settingName: string, defaultValue: Type): Type {
  const workspaceConfig = workspace.getConfiguration("leap");
  const settingValue: Type | undefined = workspaceConfig.get(settingName);
  return settingValue ? settingValue : defaultValue;
}
