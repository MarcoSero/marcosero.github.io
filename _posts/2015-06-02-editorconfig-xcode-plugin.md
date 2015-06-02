---
layout: post
title:  EditorConfig Xcode Plugin
date:   2015-06-02 16:00:21
categories: iOS
---

I love keeping most of my configurations in dotfiles and I rely on them for pretty much everything I can.  
When I first discovered [EditorConfig](http://editorconfig.org) I was excited to finally have a way to set my indentation settings once in a dotfile and having the editor, whatever that  is, apply those settings.  
Unfortunately though, it was lacking a Xcode plugin, so [I built it myself](https://github.com/MarcoSero/EditorConfig-Xcode).

When opening a file, the plugin looks for a file named `.editorconfig` in the directory of the opened file and in every parent directory.
Once the file is found, the coding styles for the file extension will be read and the plugin will dynamically change the Xcode settings to match the style.

This is particularly useful in different scenarios:

- When contributing to a project which has a different style guide from what you normally use, you can just use a different `.editorconfig` to override the default settings.
- If you like having different indentation settings for different languages (e.g. Objective-C and Swift).
- You prefer your indentation settings to be editor-agnostic.

For now the plugin supports `indent_style`, `indent_size` and `tab_width`, but I’m planning on adding support for some more settings soon.