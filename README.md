# Setting Up Dev Environment

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

# Project Architecture

This is a modern single-page web app, and as such it's designed around a clear client/server architecture. A set of static files, which is the HTML, CSS, JavaScript and images that make up the client application. Separately, a server application runs on Node.js, and serves up all the necessary data as JSON from REST services. Both are programmed in TypeScript and compiled to JavaScript.

## Common Code

Since both the client and server are in TypeScript, they can share code. This is all in the `common` directory.

### Models

The main code they share is the models, which represent the structure of the elements returned from REST endpoints. You can find these in `common/models`. A model is just simple classes composed entirely of public member variables. No privates, no methods, and no inheritance. They can contain fields that are lists or maps, but never other classes. As such, they represent the agreed upon schema for the REST endpoints.

Each model is it's own file, and exports a single class.

## Server

The server code is hosted in the `server` directory.

### Static Assets

Requests to the root URL return a minified file containing all the HTML, CSS and JS that composes the client app. Any assets which can't be directly included into this minified file, which is to say images, are put in the `assets` folder, and any requests that route to `/assets/` will just return the raw file requested.

### REST

Any requests routed to `/rest/` will hit the REST endpoints. The server is primarily a set of well structured REST endpoints. These endpoints are built like properly normalized database tables. They are a set of collections, and the elements within a collection can be requested individually by ID.

Endpoints can accept GET, POST and DELETE requests. GET requests will return some JSON elements. POST requests will create or change these elements. DELETE requests will remove elements, or more accurately disable or hide them, as data should never truly be deleted.

While these endpoints may be similar in structure to the backing database, they aren't a 1-to-1 match. The REST layer provides access controls, hiding sensitive fields, blocking access to elements the user shouldn't be able to see, and preventing changes they shouldn't be allowed to make. GET requests return JSON objects, but they can return JSON objects which contain lists or maps, including lists or maps of foreign keys, instead of needing to be simple flat data. However, fields containing other structured objects is not supported. If this is needed, those objects should go in their own collection, with denormalized foreign keys.

Foreign keys that reference other collections take the form of the URL that would be used to request that element. This is important: The client should never have to construct a URL, except to add query parameters to the end. There will simply be one hardcoded URL as the entry point into the REST data, and all other URLs are provided from there.

The endpoint can also, at it's discretion, provide some degree of denormalization. This is where it packages additional elements which are likely to be requested immediately afterward into the same request. This is how we avoid the problem of well-normalized data requiring a series of slow requests in sequence.

The response for a GET request takes this form:

```JSON
{
	"url1": {
		// ...
	},
	"url2": {
		// ...
	},
	"url3": {
		// ...
	},
	// ...
}
```

The element that was directly requested will always be in this list, and any number of other elements may be as well. The details on how the other elements are cached and used by the client is in the client section.

Each REST endpoint is managed by a matching file in `server/rest`. For instance, the `user/:user_id` endpoint is in `server/rest/user.ts`. This file exports a single function, which takes an `Express.Application` object, and registers the endpoint's route with all the HTTP methods it supports, and functions to execute those requests. All access control is done in these functions.

### Model Managers

While the Models, and the REST endpoints in general, may not have a 1-to-1 mapping to the database, all of the data display and manipulation done through them drawing from or committing to the database, and thus while the models themselves may be shared, the code to manipulate those models must live on the server.

The `server/managers` folder contains a file for each model. Each of these exports one class, which contains methods for getting, changing or deleting these models. The manager thus serves as the interface between the structure of the REST endpoints and the structure of the database.

Note that the managers do not do any access control. That is religated to the REST endpoints themselves. By the time the manager is executing, it's assumed it has permission to do whatever it's being asked to do.

## Client

React/Redux in Typescript, in the `client` directory.

TODO: Flesh out this design.
