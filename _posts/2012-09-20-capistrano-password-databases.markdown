---
layout: post
title:  "Databases' passwords"
date:   2012-09-20 21:35:46
categories: Rails Github Capistrano
---

I push the source code of this blog both on GitHub and to my EC2 instance, where it runs.
  
The file `config/database.yml` stores sensible informations like database's passwords, and I didn't want to push it on GitHub.  
After a quick search on stackoverflow I didn't find any answer to my problem, but then I solved it.  
I don't know if it is the _best_ way, but this is what I did.
 
Since I don't have to modify the file `database.yml`, I copied it to my EC2 instance and then I added it to `.gitignore`.  
Then, I added a capistrano's task in `deploy.rb`, to link `database.yml` to the current directory of deployment:

    # copy db config
    after "deploy:update_code", :copy_db_config
    desc "copy db config file"
    task :copy_db_config do
      run "ln -s ~/path/where/I/copied/database.yml #{release_path}/config/database.yml"
    end
    
Hope this help.