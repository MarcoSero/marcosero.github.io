---
layout: post
title:  "Learning game development"
date:   2013-09-09 20:42:46
categories: [Unity3D, Game Development]
---

Every now and then, I get keen on a new technology and I decide I want to master it (even though I rarely do it). It can be a new programming language, a new MVC framework, a new platform and so forth.

Two weeks ago I realised I knew nothing about game development and, since I am both a developer and a gamer, I had to fix that.

First off, I asked myself two simple questions:

1. What kind of games I would like to create (2D/3D)
2. What platform I want to develop for

The answer to the first question was easy: since I like to learn things *the hard way*, I obviously went for learning *3D* game development (stupid me!).  
As for the platform, nowadays mobile seems to be the most profitable market. But since I rarely play games on my iPhone and iPad I wanted something as multi-platform as possible.

I thought about creating my own game engine, but as I don't have as much spare time to put aside, I quickly left this option.  
Therefore I started investigating the best 3D game engines, which I think at the moment are:

- Unreal Engine (the one of Gears of War and Infinity Blade)
- Unity3D (The Room and [many others](http://unity3d.com/gallery/made-with-unity/game-list))
- Source Engine by Valve (Half Life, Portal, Team Fortresse etc.)

I will skip the in-depth comparison, you can find a ton of articles about it. I can just say **I went for Unity3D**.

### Unity3D and 3D modelling

I immediately dove into Unity's official documentation and tutorials, you get [tons of them](http://unity3d.com/learn).  
Both documentation and tutorials are really good, but after finishing them. The number of different ways for learning we have nowadays still amazes me.

As scripting language I could choose between **Javascript** and **C#** (Boo wasn't really a choice since doesn't support iOS development). Both languages are very solid and their ease of use makes them the perfect language to start with (anyone said no *hipster-syntax*? :P).  
By the way, I picked C# as it is statically typed.

For 3D modelling the obvious choice was Blender: very large community and free. I know it is awful but it does the job, trust me.  
I didn't really learn anything about it, just followed some simple step-by-step tutorial on how to make a very simple level with walls and floors, nothing more (yet).

### The game

To make the most of my learning, what's best than creating a simple yet real game? Since guns and zombies are always fun for most of people, I started creating *"Zombie Slaughter"* (I still think this name is too crude).

I started with a simple first person controller to navigate the level modelled in Blender

<iframe width="640" height="430" src="//www.youtube.com/embed/nvt6T9asRC8?rel=0" frameborder="0" allowfullscreen></iframe>

Then, I decided to add some zombies to play with their AI: I used the [A*](http://en.wikipedia.org/wiki/A*_search_algorithm) pathfinding algorithm to make them following the player. They update their path in interval from 0.5 to 1.5 seconds (to avoid overhead) and only if the player changes position during that time frame.
It was good playing with an algorithm studied during university and never really used before.  

Also, I added a normal zombie-walking animation to them, using the new Unity's [Mecanim](http://unity3d.com/unity/animation/) animation system (which is awesome, by the way).

<iframe width="640" height="430" src="//www.youtube.com/embed/OOcMs-PNkTA?rel=0" frameborder="0" allowfullscreen></iframe>

After giving zombies a brain (kind of) and making them walk, I realised I haven't implemented any shooting yet (which actually happens to be the core of the game!).  
Thus I started adding a huge badass revolver to my character and I implemented the underneath logic for the game: two shots and a zombie gets killed.

Also the game was still a bit too naked. There was no texture at all and lights were just too bright. I couldn't feel a dark and gloomy atmosphere you can usually feel in a zombie game. 

That was the right time to learn something about textures and materials.  
To create simple materials that feel real, it is important to make different assets for each texture which describe how the material receives the light and which part of it are more in relief. 
Only in this way it is possible to create from a simple seamless image like this one

![image](../images/floor-texture.jpg)

a real 3D material:

![image](../images/floor3d.gif)

I used the magic [CrazyBump](http://www.crazybump.com/) for that, gorgeous tool.

After having applied some textures and tweaked lights, I added some animations as well. Especially I create the running and dying animation for the zombie, so that when there is a new horde zombies start running, and when they get shot the player can actually see that with a nice animation.

After quite a lot of work, this is what I got.

<iframe width="640" height="430" src="//www.youtube.com/embed/YjLTGf3AsZ8?rel=0" frameborder="0" allowfullscreen></iframe>



### What I learned


This is how far you can get playing with Unity3D in one week and half, not bad considering the tons of stuff you learn in the process.

The main lesson I learned is that game development (at least in Unity) is just 10% about programming, the rest is equally split between 3D modelling and game design. That's it.  
Most of the code I wrote is dead simple, just some simple [vector arithmetic](http://docs.unity3d.com/Documentation/Manual/UnderstandingVectorArithmetic.html) and if-then-else statements.

PS: If you're starting out with Unity like I did, I definitely recommend, besides Unity's official tutorials, the YouTube channel [quill18creates](http://www.youtube.com/user/quill18creates) and the great [Turncoat Dev Diary](http://iphonedevelopment.blogspot.co.uk/) by Jeff Lamarche.