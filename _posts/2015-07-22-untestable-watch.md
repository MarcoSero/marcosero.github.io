---
layout: post
title: An Untestable Watch
date:   2015-07-22 22:00:21
categories: iOS
---

The big difference in watchOS 2 is that the code in the watchOS Extension now runs on the actual watch, as opposite as running on the iPhone like it used to. That means a new CPU with a different architecture.  
It would be nice testing that code on an actual device before shipping it, right?  

Well, we are out of luck since it seems `XCTest` does not support watchOS yet.
There's no `XCTest` framework in the watchOS SDK and trying to use it causes compiler errors, since the headers only support either `UIKit` or `AppKit` (and watchOS has none).

I duped [rdar://21760513](https://openradar.appspot.com/21760513). You should probably do that too!


