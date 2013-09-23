---
layout: post
title:  "Life of a Dev"
date:   2012-09-13 21:35:46
categories: [Ruby, Rails]
---

Only ten days ago, I [was writing](http://lifeofadev.eu/posts/thoughts-of-a-rails-and-ruby-beginner) about how beautiful is Ruby and how powerful is Ruby on Rails to develop web applications.  
Today, I have (almost) finished to develop this blog.

I don't know if you noticed some changes because I tried to no upset the CSS, but under the hood everything is different.  
Now this blog runs as a Ruby on Rails application in my dedicated Amazon EC2 instance. I left Wordpress to have the total control of the source code and to add only features which I care about.  
I decided (for now) to continue using MySQL, but I'm tempted to switch to PostgreSQL or MongoDB in the near future to try something different.

This is my first project in Rails (obviously!), but I'm pretty pleased of my work.

### Features

Until now I implemented these features:

- Posts with \*\*_markdown_\*\* syntax and draft option
- Categories (but not tags, I hate them)
- Users
- Authentication with salted password
- Unit tests
- Admin panel to manage posts and users
- HTML and CSS
- Code syntax highlighting
- Twitter Bootstrap integration
- Comments with Disqus

<div style="width:600px;margin:20px">
<a href="http://cl.ly/JRYl" target="_blank"><img src="http://f.cl.ly/items/0o2M2T0X2A2H303d473z/admin.png" width=280px></a>
<a href="http://cl.ly/JRUE" target="_blank"><img src="http://f.cl.ly/items/2S3A333k1B0p1z0d1R14/post.png" width=280px></a>
</div>

But there are also some tasks that I want to realize:

- Functional and integration tests
- Image uploading (at this moment Cloud App or FTP is my friend)
- Responsive layout (if there is a CSS magician here, let me know :D)

If you are interested you can find the source code on [GitHub](https://github.com/MarcoSero/lifeofadev.eu).  
Please feel free to send me every feedback or issue tracking, both here or on GitHub.

### Why _another_ CMS?

To people who ask me why I have done _another_ CMS, I would cite Marco Arment about his project [Second Crack ][1](which is, exactly, another CMS):

*Don't a lot of these static-file blogging engines already exist?*
> Yes.

*Isn't this reinventing the wheel?*
> Yes.

*Don't you have other things you could be working on?*
> Yes. (Don't we all?)

*What have you done differently from [existing solution]?*
> A bunch of small things, probably. I don't know enough about the other solutions to really say.

*Why doesn't it have [feature]?*
> Because I didn't think [feature] needed to be there. Some anticipated frequent values for [feature]:  
> - Comments: Use Disqus or Facebook comments. Or just go without comments. Do you really need them?  
> - Stats: Use Google Analytics or Mint. (Or both.)  
> - Widgets and dynamic page content: Use Javascript.  
> - Dynamic rendering for automatic mobile layouts, etc.: Use CSS.

*Why should I use this instead of [existing solution]?*
> I don't know. You probably shouldn't.

*Will this make you, me, or anyone any money?*
> I doubt it.

*So why did you make this?*
> **Because I'm a programmer, and this is what I do.**

> Some people jog away from their house every day, only to jog back. Others walk on a treadmill, expending energy to get nowhere. In both cases, it may appear to others that they've accomplished nothing, but they've chosen to do these seemingly redundant activities on a regular basis to incrementally improve themselves. And it works.

  [1]: https://github.com/marcoarment/secondcrack