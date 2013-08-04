---
layout: post
title:  "StatusBoard + BitBucket"
date:   2013-04-12 21:35:46
categories: Ruby Bitbucket Github
---

When it comes to nerdy stuff, here I am.

In our office at [The App Business][1], we have finally found a purpose for our old iPad 1: Status Board. We are displaying the [status of builds on our Jenkins machine][2] on our 40" TV.

But we want more. We want to be able to see the latest BitBucket's issues of our all repositories.

So I wrote a simple ruby script which creates an html table of issues ordered by creation date and saves it on Dropbox.  
You can find it on [GitHub][3].
<br>

![BitBucket][4]

<br>
You have to setup the config inside the file `issues.rb`

    config = {
      username: 'you',
      password: 'your_password',
      repo_owner: 'your_company_or_you',
      dropbox_folder: '/Users/marcosero/Dropbox/sync'
    }

 and then create a timed launcher for it. Something like this

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.marcosero.status_board_issues</string>
    <key>ProgramArguments</key>
    <array>
        <string>ruby path/to/issues.rb</string>
    </array>
    <key>StartInterval</key>
    <integer>300</integer>
</dict>
</plist>
{% endhighlight %}


and then copy it and start it:

    $ cp com.marcosero.status_board_issues.plist ~/Library/LaunchAgents
    $ launchctl load -w ~/Library/LaunchAgents/com.marcosero.status_board_issues.plist

  [1]: http://www.theappbusiness.com/
  
  [2]: http://www.merowing.info/2013/04/statusboard-and-jenkins/

  [3]: https://github.com/MarcoSero/StatusBoard-BitBucket

  [4]: https://raw.github.com/MarcoSero/StatusBoard-BitBucket/c1bdf5a7fdca31a6183fd16e39ce6266ceb577b6/bitbucket.jpg