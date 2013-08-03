---
layout: post
title:  "Sublime Text 2"
date:   2012-09-19 21:35:46
categories: Sublime
---

After MacroMates announced that TextMate 2 was available on [GitHub](https://github.com/textmate/textmate), I ([wrongly](https://github.com/textmate/textmate/commits/master)) concluded that it was probably going to be abandoned.

Because of that, I began to consider other text editors, and my attention was caught by [Sublime Text 2](http://www.sublimetext.com/2).  
Now it's my main text editor, and here there are few tweaks that let you to improve it.


### Enable Sublime in command line
If you want to use Sublime in your terminal, you can add a symbolic link to its executable:
 
    sudo ln -s "/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl" /usr/bin/subl
    
Type `subl --help` to check if it works.

### Custom icon
Honestly, the Sublime icon sucks.  
I replaced it with a new one and then I created a script to automate the change.

- Download the icon with the script [here](http://cl.ly/JWav)
- Run `unzip sbicon`
- Execute the script `./mac_replace_icons`

### Install Package Manager
Like TextMate, also Sublime has its packages. You can install the Package Manager pressing **^**+**`** to open Sublime's console and copying this string

    import urllib2,os; pf='Package Control.sublime-package'; ipp=sublime.installed_packages_path(); os.makedirs(ipp) if not os.path.exists(ipp) else None; urllib2.install_opener(urllib2.build_opener(urllib2.ProxyHandler())); open(os.path.join(ipp,pf),'wb').write(urllib2.urlopen('http://sublime.wbond.net/'+pf.replace(' ','%20')).read()); print 'Please restart Sublime Text to finish installation'
    
After relaunch it, you can add new packages pressing **&#8984;**+**&#8679;**+**P** and selecting _Package Control: Install Package_.

There are _a lot_ of packages for almost everything you need, and a lot of TextMate packages are now available for Sublime.


### Install custom theme and color schemes
Sublime it's not exactly beautiful. It's pretty ugly. Because of that I installed the [Soda theme](https://github.com/buymeasoda/soda-theme) to make this more Mac-like.

You can install it through package manager and to enable it you have to add the line below to your user's settings **&#8984;**+**,**

    {
        "theme": "Soda Light.sublime-theme"
  }

There are two different variant of this theme, Light and Dark, both beautiful.

You can use the default Sublime's chrome-like tabs, but I prefer Soda's more squared custom tabs

    "soda_classic_tabs": false
    
With Soda I installed also a custom colour schemes, you can download them [here](http://buymeasoda.github.com/soda-theme/extras/colour-schemes.zip).  
Unzip and place the extracted `.tmtheme` files in the Sublime's `Packages/User` folder. You can find it under _Preferences/Browse Packages_.

To activate one of them, add the line

    "color_scheme": "Packages/User/Monokai Soda.tmTheme"
    
in your user's settings.

![image](http://f.cl.ly/items/1c0e2m263y181S1t2y2B/sublime.png)

Beautiful, I know :P

### Custom syntax-based prefs
This is the last tip. If you want to have preferences based on programming language you are using (like 2 spaces tabs in Ruby), open the file and set your preferences in _Preferences/Settings - More/Syntax Specific_



## EDIT
The twitter user [@iduke84][1] shared with me its script to open selected files with Sublime Text 2.

<blockquote class="twitter-tweet tw-align-center" data-in-reply-to="248412855286759424" lang="it"><p>@<a href="https://twitter.com/lifeofadev">lifeofadev</a> I created an useful script for open the selected file from finder with Sublime Text. Got it at <a href="http://t.co/ZRDu43Of" title="http://www.donatellosantoro.com/script/">donatellosantoro.com/script/</a></p>&mdash; iduke84 (@iduke84) <a href="https://twitter.com/iduke84/status/248442306502479872" data-datetime="2012-09-19T15:23:56+00:00">Settembre 19, 2012</a></blockquote>
<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

 Give it a try!





  [1]: https://twitter.com/iduke84
