# Setting up dev environment

This is intended to be edited on Windows, using VS Code with WSL. The included instructions and project files are designed for that use case. If you wish to use a different dev environment, you're on your own.

## Node.js

Install Node.js like so:

```
sudo apt-get install nodejs
```

TODO: Add instructions for making Node grab dependencies.

## MariaDB

This uses MariaDB as the database. This is a drop-in replacement for MySQL, so in principle MySQL should work just as well, but the instructions here are for installing MariaDB.

To install MariaDB:

```
sudo add-apt-repository ppa:mysql-ubuntu/mariadb-10.1
sudo apt-get update
sudo apt-get install mariadb-server
```

Then start the server with:

```
sudo service mysql start
```

And do the initial setup with:

```
sudo mysql_secure_installation
```

Since this is a local development setup, leave the password blank on root, and don't remove the anonymous users. But you should disallow connections from outside localhost, and remove the test database (you won't need it), and reload the privilege tables.

TODO: Add instructions for setting up the initial test database.

## Visual Studio Code

Download Visual Studio Code from here: https://code.visualstudio.com/download

Once it's installed and booted, go to File -> Open Folder... and select the folder where to which you've pulled the git repo.

TODO: Add instructions for using the build tasks to compile and run the server.