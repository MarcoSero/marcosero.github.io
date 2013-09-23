---
layout: post
title:  "Goodbye MongoDB"
date:   2012-07-17 21:35:46
categories: [Ruby]
---

I'm using MongoDB for my thesis work, and unquestionably it is full of great features. I choose it for its awesome handling of geo-located documents and its quick queries.

There are many other excellent features:

- you can index ANY attribute
- "agile and scalable" as 10gen says
- very quick
- awesome documentation and drivers for any language
- integrated Map/Reduce (even if too slow)
- Apache licence
- and so on...

But on the other side there are many features not exactly friendly.

In [this great article](http://www.zopyx.com/blog/goodbye-mongodb), a zopyx's employee explains why they said "goodbye mongodb".

He criticized these features:

>Locking: a global lock for any operation is like a suicide
>Query language: not very easy (for who already knows SQL)
>Map/Reduce: its slowness is due to the monothread Javascript engine (for that reason, I used MongoDB+Hadoop in my thesis)
>Journaling: MongoDB pre-allocates 3 GB of data for journaling - independent of the actual database size(s) - insane for small installations

I completely agree with him. In particular on locking and Map/Reduce problems.

The employee ends his article with

>MongoDB is currently more about marketing and hype than it deserves. The primary goal of 10gen is currently running through the world in order to tell the world how cool MongoDB is.

Here I disagree. MongoDB has a great potential and 10gen's guys are working hard and well to improve their project.