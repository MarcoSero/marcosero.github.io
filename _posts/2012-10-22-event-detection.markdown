---
layout: post
title:  "Event Detection"
date:   2012-10-22 21:35:46
categories: iOS MongoDB Hadoop
---

This project is my thesis work for my bachelor degree at the Department of Computer Science of University of Turin.  
This is what I worked in the last six months and I am very proud of it.

________

#### What is it?  

**A system to detect geotagged events through the analysis of social networks.**

#### What is an event?

An event is a large number of tweets and photos **geographically close** with the same ***#hashtag***.

#### How does it work?

- Geotagged tweets (from Twitter) and photos (from [Teleportd][1]) of the last three hours are collected and saved in a database.
- An algorithm group this points in different clusters, based on theirs hashtag and coordinates.
- If a clusters has enough points, it's marked as event.

#### Does it really work?

There are a lot of false-positive, also called "fake events", so the blacklist of hashtag is continuously growing. But at this time I am satisfied on how my algorithm works.

________

### The Algorithm
#### Just a bit of background
The algorithm use the map/reduce logic to analyze tweets and photos in MongoDB and to create geolocated **events**.  

A *point* is a tweet or a photo, with an hashtag and a geotag.  
A *cluster* is an event, with a number of points analyzed and a number of neighboring points to analyze.

#### Hadoop

I choosed [Hadoop](http://hadoop.apache.org/) to realize Map/Reduce because it is the most widely used framework for this kind of job and it has large documentation.  
In this way, I don't care about multithreading and multiprocessing and I leave Hadoop this kind of jobs.

The algorithm is running on a server with 16 cores and 32GB of RAM.
This is my [mapred-site.xml](http://cl.ly/IrX1) if someone cares.

#### MongoDB

After a deep research in many relational and not relational database, [MongoDB](http://www.mongodb.org/) was my choice. It has a great documentation, a powerful support of geolocated queries and it is very scalable.  
The Mongo-Hadoop plugin let me to integrate it in MongoDB. Its config options are in the file `mongo-dbscan.xml`.

#### Map
The map function reads the points in input. All points are not visited; this is due to the input query execute in MongoDB from Hadoop.  
If a point has enought points in neighborhood, then a cluster will be emitted and the point is marked as clusterized; otherwise, do nothing.

    function map(P, eps, MinPts)
        if P is unvisited then
            mark P as visited
            NeighborPts = regionQuery(P, eps)
            if sizeof(NeighborPts) < MinPts then
                do nothing
            else
                mark P as clusterized
                prepare the key
                create new cluster C
                C.neighborPoints = NeighborPts
                C.points = P
                emit(key, C)

#### Reduce
The reduce function has in input an 'array' of clusters with the same key.  
Its job is to aggregate these clusters and to analyze their neighborhood to merge all points into a unique cluster.  
This method can be called much times, virtually every time the map function emits a new cluster with a key equals to another cluster.

    function reduce(key, clusters, eps, MinPts)
        finalC is the final cluster
        for all C in clusters do
            finalC.points = finalC.points ∪ C.points
            for all P in C.neighborPoints do
                if P′ is not visited then
                    mark P′ as visited
                    NeighborPts′ = regionQuery(P′,eps)
                    if sizeof(NeighborPts′) ≥ MinPts then
                        NeighborPts = NeighborPts ∪ NeighborPts′
                    end if
                end if
                if P′ is not yet member of any cluster then
                    add P′ to cluster C
                end if

________

### The iOS App

Once the server-side system was up and running and the algorithm worked, the last step was to create a client application that lets users to find these events.  
I decided to develop an iOS application, with a bunch of social features to let users not only to view the events, but also to interact with them. For each events is possible to find what are the users that are taking part of it, viewing the last tweets and photos on the map.

![ios][1]

_______

### The Speech

Here there are the slides of my speech on 19th of October.

<script async class="speakerdeck-embed" data-id="5084689ff713ac00020455c1" data-ratio="1.3333333333333333" src="//speakerdeck.com/assets/embed.js"></script>

________

### More infos

The official website of the app and the project is [http://eventdetection.marcosero.com/][2].  
The code of the algorithm and of the iOS app are both on GitHub:

- [Event Detection - The Algorithm][3]
- [Event Detection - iOS App][4]

  [1]: http://teleportd.com/

  [2]: http://eventdetection.marcosero.com/

  [3]: https://github.com/MarcoSero/Event-Detection

  [4]: https://github.com/MarcoSero/Event-Detection-iOS-App

  [1]: /system/assets/images/000/000/002/large/slide.png