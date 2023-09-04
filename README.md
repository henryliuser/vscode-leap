# Better Leap Extension for Visual Studio Code

Leap provides an easy way to move the cursor in vscode without using the mouse. Based on leap.nvim

## Feature Overview

Leap lets you jump to any location in the visible editor area by entering a two-character search pattern and then possibly a tag character to select your destination from multiple matches.

## Extension Settings

### Keybindings

Define new keybinds using the `"leap.find-forwards"` and `"leap.find-backwards"` commands.

### Emulating Vim

Example using the [Vim extension](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim), mimicking [leap.nvim](https://github.com/ggandor/leap.nvim):

```json
"vim.normalModeKeyBindingsNonRecursive": [
    {
        "before": ["s"],
        "commands": ["leap.find-forwards"]
    },
    {
        "before": ["S"],
        "commands": ["leap.find-backwards"]
    }
]
```

## Release Notes

### 1.1.0

- Labels don't take space anymore (text does not shift when showing labels)
- Labels are set from the cursor position rather than always from up to down

### 1.0.0

Working like leap.nvim (showing labels from first key) - missing safe labels implementation

### 0.0.3

The behaviour when searching for whitespaces has been improved.

### 0.0.2

The end of a line now acts as if it had trailing whitspaces. Try jumping to the end of it by pressing `space` twice.

### 0.0.1

Initial release 🎉

**Enjoy!**
