---
layout: post
title:  "Rails + Capistrano"
date:   2012-09-16 21:35:46
categories: [Rails, Capistrano]
---

To run this blog, I must admit that I encountered some problem to have everything working.  
Because of that, I wrote for myself a simple guide to setup a deployment enviroment with Ubuntu/Debian, and I would to share it (tested on **Ubuntu 12.04**).

#### Put you code under version control
This is the first step to deploy your code. I use `git`, to install it (you can find it [here](http://git-scm.com/)).
After installation, init your app

    cd yourapp
    git init
    git add .
    git commit -m "initial commit"

## Deployment

### SSH Stuff
To connect to your deployment machine I recommend to setup a custom SSH connection.  
Generate a key on the development machine:

    ssh-keygen
    
Walk through the key generator and set a password, the key file by default goes into `~/.ssh/id_rsa`.

Next, you need to copy the generated key to the remote server where you want to setup password-less login with

    cat ~/.ssh/id_rsa.pub | ssh user@remotehost 'cat >> ~/.ssh/authorized_keys'

And then edit the file `~/.ssh/config` to have something like that:

    Host host
    HostName remotehost
    User user
    IdentityFile ~/.ssh/id_rsa
    
After you have restarted your shell, check if login works password-less

    ssh user@remotehost
    
The next steps have to be executed on your deployment machine.  

### Install Ruby and Rails
To deploy, you have to install Ruby and then Rails. To do it, I would recommend you to use RVM (Ruby Version Manager) instead of APT, because lets you to install multiple Ruby versions and use them all together.

So, no more chatting! Install ruby + rails via RVM  and then load it in all opened shells

    curl -L https://get.rvm.io | bash -s stable --rails
    source ~/.rvm/scripts/rvm

### Install Nginx + Passenger
To make Rails works with your favorite web server, you have to install the Passenger's gem and module.  
I used **nginx**, but for Apache is pretty similar.

Install the gem and then install nginx with Passenger's module

    gem install passenger
    rvmsudo passenger-install-nginx-module

This step could take some minutes, but if everything goes ok, copy these lines to `/opt/nginx/conf/nginx.conf`

    passenger_root /home/user/.rvm/gems/ruby-1.9.3-p194/gems/passenger-3.0.17;
    passenger_ruby /home/user/.rvm/wrappers/ruby-1.9.3-p194/ruby;
    
Setting the preferences of your webserver inside `http { … }`

    server {
        listen 80;
        server_name yourapp.com;
        root /home/youruser/public_html/yourapp/current/public;
        passenger_enabled on;

        access_log /home/user/public_html/yourapp/current/log/access.log;
        error_log /home/user/public_html/yourapp/current/log/error.log;
    }

Be sure to point to `current/public` folder!

Then, create a script to control nginx:

    wget -O init-deb.sh http://library.linode.com/assets/660-init-deb.sh
    sudo mv init-deb.sh /etc/init.d/nginx
    sudo chmod +x /etc/init.d/nginx
    sudo /usr/sbin/update-rc.d -f nginx defaults  

You can now control nginx with this script

    sudo /etc/init.d/nginx stop
    sudo /etc/init.d/nginx start
    

### Install your favorite DB
I installed MySQL, not my favorite but one of the most known.

    sudo apt-get install mysql-server mysql-client
    sudo apt-get install libmysql-ruby libmysqlclient-dev 
    gem install mysql2

(I used `mysql2` gem because is better than its old daddy `mysql`. More info <a href="https://github.com/brianmario/mysql2" target="_blank">here</a>)


### Install node.js
One of the other things you’ll want is Node.js. This will help you do the compiling of assets on deployments

    sudo apt-add-repository ppa:chris-lea/node.js
    sudo apt-get -y update
    sudo apt-get -y install nodejs`


### Deploy with capistrano
To deploy, the first step is to create a remote repository in which push your code, so SSH into your deployment machine and create it.

    # on remote-deployment machine
    mkdir -p ~/git/yourapp.git
    cd ~/git/yourapp.git
    git --bare init

Then, add `gem 'capistrano'` to your Gemfile, install it
    
    bundle install
    
and set `git` to push to you deployment machine

    bundle pack
    git add Gemfile Gemfile.lock vendor/cache
    git commit -m "bundle gems"
    git remote add origin host:git/yourapp.git
    git push origin master

The last thing to do is to edit the file `config/deploy.rb` to let Capistrano to work with your deployment machine.  
Set `:deploy_to` to your public folder in which you have your webserver's files.

    set :user, 'user'
    set :domain, 'yourremotehost'
    set :application, 'yourapp'
    
    set :repository, "host:git/#{application}.git"
    set :deploy_to, "/home/#{user}/public_html/#{application}" 
    ssh_options[:keys] = %w(~/.ssh/id_rsa)
    
    # miscellaneous options
    set :deploy_via, :remote_cache
    set :scm, 'git'
    set :branch, 'master'
    set :scm_verbose, true
    set :use_sudo, false

Finally, init capistrano

    cap deploy:setup

check if everything works

    cap deploy:check

run your migrations

    cap deploy:migrations
    
and deploy your app

    git add .
    git commit -m "add cap files"
    git push
    cap deploy

Do not hesitate to tell me "Hey, you wrote a lot of bullshit!", because it's possibile that I forget something.

Do not expect that everything works the first time because there is _a lot_ of stuff, but this worked for me so I hope it works for you too.