import { commands, ExtensionContext, workspace } from "vscode";
import { LeapWidget } from "./leapWidget";

export type SearchDirection = "backwards" | "forwards";

let widget: LeapWidget | undefined;

function getWidgetInstance(context: ExtensionContext): LeapWidget {
  if (!widget || !widget.isActive) {
    widget = new LeapWidget(context);
  }
  return widget;
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
    ],
  );
}

function getSetting<Type>(settingName: string, defaultValue: Type): Type {
  const workspaceConfig = workspace.getConfiguration("leap");
  const settingValue: Type | undefined = workspaceConfig.get(settingName);
  return settingValue ? settingValue : defaultValue;
}
