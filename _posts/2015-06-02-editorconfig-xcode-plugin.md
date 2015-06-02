---
layout: post
title:  EditorConfig Xcode Plugin
date:   2015-06-02 16:00:21
categories: iOS
---

Contributing to different projects is fun, but unfortunately each of them has a different style guide when it comes to indentation.
e.g. I prefer indenting my Objective-C code with 2 spaces, because I think it’s a good compromise between readability and screen real estate, but that’s different from the 4 spaces indentation we use internally at Yammer.

Manually changing Xcode’s preferences to be aligned with the style guide of the current project is definitely an option, just not a very good one.

When I started looking for a solution, [EditorConfig](http://editorconfig.org) seemed like the perfect tool for my problem, but it was lacking a Xcode plugin.

So [I built it myself](https://github.com/MarcoSero/EditorConfig-Xcode). Hopefully it will be useful for others too.