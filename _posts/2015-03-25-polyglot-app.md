---
layout: post
title:  A Polyglot iOS Application
date:   2015-03-25 20:33:21
categories: iOS
---

A couple of weeks ago I was in San Francisco to attend the Yammer Hack Day.
For my hack, I wanted to explore new ways of sharing some code across our different mobile apps. So I set myself up for the challenge of writing a C++ image cache and to have it working on both iOS and Android by the end of the day.

Even with my rather poor C++ foo, in a couple of hours I had the C++ implementation fully working. But I had no idea how to integrate it in the actual apps.

Luckily for me, Dropbox has released an open source tool, [Djinni](https://github.com/dropbox/djinni), to do just that: it takes a C++ implementation and creates the Objective-C and Java interfaces, so that is possible to reuse the same C++ code without worrying about the inter-language communication, which is taken care of by the tool itself.
If you’re interested and want to know more about it (you should!), check out [the slides](https://speakerdeck.com/marcosero/do-not-repeat-yourself) of my Hack Day presentation and Dropbox’s [announcement of Djinni](https://www.youtube.com/watch?v=ZcBtF-JWJhM) at CppCon.

Although I didn’t win, I was pretty happy with my hack.
Not because of what I achieved, but for how simple eventually it turned out to be.

So a few days ago I went a step further: I just wanted to write a simple iOS app using as many programming languages as possible, just for fun and to see how much overhead is caused by the unavoidable inter-language communication.

So I chose a different languages for every different component in the app:

- **Swift** for the front-end, views and controllers
- **JavaScript** to serialize and unserialize the JSON store. Why? Why not!
- **C++** because I already had the in-memory and on-disk image cache
- Machine-generated **Objective-C++** to work with the C++ image cache (thanks to Djinni I didn’t have to write it myself)
- And of course **Objective-C** to make all this possible

<img src="../../images/polyglot.jpg" width="700" >

I tried to minimize the overhead and complexity of using different languages by separating the components as much as possible and declaring simple and clear interfaces.

If you’re interested you can check out the code on [GitHub](https://github.com/MarcoSero/PolyglotApp).