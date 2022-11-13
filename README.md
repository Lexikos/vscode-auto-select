# AutoHotkey Auto-Select

Automatically switches between the "ahk" and "ahk2" languages, when detected.

## Features

Automatically switches the document language in the following cases:
  - When `#Requires AutoHotkey v` is detected after switching to a file for the first time.
  - When the `ahk2` extension emits a diagnostic message containing " v1 ".
    + This is generally for a line like `MsgBox,` or `#NoEnv`.

This has been tested with the following extensions:
  - [AutoHotkey v2 Language Support](https://marketplace.visualstudio.com/items?itemName=thqby.vscode-autohotkey2-lsp) by thqby
  - [AutoHotkey Plus Plus](https://marketplace.visualstudio.com/items?itemName=mark-wiemer.vscode-autohotkey-plus-plus) by Mark Weimer
  - [AutoHotkey NekoHelp](https://marketplace.visualstudio.com/items?itemName=cat1122.vscode-autohotkey-neko-help) by CoffeeChaton

It works best with the v2 extension set as the default for .ahk files, since it handles v1 files much more gracefully than the v1 extensions handle v2 files.

## Requirements

Language extensions with ID `ahk` and `ahk2` must be installed and enabled.

## Extension Settings

Nothing is configurable yet.

## Known Issues

Detection is very basic.

Some language extensions (i.e. NekoHelp) scan all present .ahk files and emit diagnostics even if a different language extension is set as the default and/or selected for those same files. This causes many spurious warnings and errors in files which are written for a different version of AutoHotkey. This would typically only be an issue when the workspace has scripts for multiple AutoHotkey versions, or if the v1 extension is set as the default for .ahk files.

## Release Notes

### 0.0.0

No releases yet.
