# Setting Up Dev Environment

This is intended to be edited on Windows, using VS Code with WSL. The included instructions and project files are designed for that use case. These instructions should need only slight modification to run on Linux, OS X, or with a Windows terminal emulator like Cygwin or MSYS2, but 

## Node.js

Install Node.js like so:

```
sudo apt-get install nodejs
```

## Node Dependencies

There are actually two node projects here, the client and the server. You'll need to install dependencies for both. To do this, do the following:

```
cd server
npm install
cd ../client
npm install
```

## Webpack

Webpack is used to package up all the client HTML, JavaScript and CSS into one big file. To install it, type:

```
sudo npm install -g webpack
```

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

## Visual Studio Code

Download Visual Studio Code [here](https://code.visualstudio.com/download).

Once it's installed and booted, go to File -> Open Folder... and select the folder to which you've pulled the git repo.

## Building

You can build the server like so:

```
cd server
tsc
```

You can build the client like so:

```
cd client
webpack
```

However, it's not recommended you build them manually. The VS Code project has build tasks for both of these. If you hit `ctrl+shift+p` and type `run` in the menu, and select `Tasks: Run Task`, you'll see a list of available tasks. Among them are `Build Client` and `Build Server`. These will do the builds. Even better, though, are the options `Watch Client` and `Watch Server`. These will initiate watch processes that will automatically rebuild any time any code changes.

## Test Database Setup

Once the MariaDB is installed, you'll want to add the database and put some basic test data in it. To do this, you'll first need to have built the server, as described above. Then you can use this command:

```
node server/setupdb.js
```

You can also use the `Setup DB` task inside VS Code.

## Running the Server

You can run the server directly by doing this:

```
cd server
node index.js
```

However, this won't refresh when the code changes. In order to do that, you'll want nodemon. You can get nodemon through npm as follows:

```
npm install nodemon
```

Then you can run it like:

```
cd server
nodemon index.js
```

You can also initiate nodemon from within VS Code with the `run server` task.

Once the server is running, just navigate to http://localhost/ to test the site.

# Project Architecture

This is a modern single-page web app, and as such it's designed around a clear client/server architecture. A set of static files, which is the HTML, CSS, JavaScript and images make up the client application. Separately, a server application runs on Node.js, and serves up all the necessary data as JSON from REST services. Both are programmed in TypeScript and compiled to JavaScript.

## Common Code

Since both the client and server are in TypeScript, they can share code. This is all in the `common` directory.

### Network

The `Network` interface is mostly used by the client, but it's needed by the models so it's included here. The interface is fairly simple:

```Typescript
interface Network {
	async request(method: HttpMethod, url: URL, body: string): Response
}
```

The `HttpMethod` type is a sum type that is one of `GET`, `POST` or `DELETE`. The `Response` type encodes all of the useful HTTP response info.

Classes that implement this interface include:
* `XMLHttpRequestNetwork` which is a direct passthrough to an `XMLHttpRequest`.
* `FakeNetwork` which is used for unit tests.
* `RestCacheNetwork` which takes another `Network` in it's constructor. When it gets a `GET` request, it first checks if the URL is in the cache, and if so returns the cached reply. If not, it passes the request through to the `Network` it was given, but strips all the additional denormalized elements out of the response and sticks them in the cache. These cache entries are very short lived, and are single-access, meaning once they've been read once they're cleared from the cache. This is to ensure that the cache only provides denormalized data that's immediately requested, and doesn't interfere in attempts to reload fresh data.

This structure ensures that if any further network behavior is ever needed, it can be isolated in it's own network layer that passes through to the layer below, with each behavior being cleanly isolated and individually tested against the `FakeNetwork`.

### Models

The main code they share is the models, which represent the structure of the elements returned from REST endpoints. You can find these in `common/models`. They follow a consistent interface format, but sadly not a consistent interface and thus can't enforce this with an `interface`.

A model's member variables are primitives, lists, or maps. They're never other classes. All member variables are public except for foreign keys, which are private URLs.

A model gets a constructor, which takes every single field on the model, including it's foreign keys, as an anonymous object that matches the structure of the model. It also has a request function for each type of foreign key on it, which is an `async` function that sends the HTTP request for the element that foreign key refers to, or functions for any `POST` or `DELETE` requests that can be made on this element. Both types of request functions take a `Network` object as an argument. All of these request functions will technically work from the server, but should really only be called from the client.

Each model is it's own file, which exports a single class.

## Server

The server code is hosted in the `server` directory.

### Static Assets

Requests to the root URL return a minified file containing all the HTML, CSS and JS that composes the client app. Any assets which can't be directly included into this minified file, which is to say images, are put in the `assets` folder, and any requests that route to `/assets/` will just return the raw file requested.

### REST

Any requests routed to `/rest/` will hit the REST endpoints. The server is primarily a set of well structured REST endpoints. These endpoints are built like properly normalized database tables. They are a set of collections, and the elements within a collection can be requested individually by ID.

Endpoints can accept GET, POST and DELETE requests. GET requests will return some JSON elements. POST requests will create or change these elements. DELETE requests will remove elements, or more accurately disable or hide them, as data should never truly be deleted.

While these endpoints may be similar in structure to the backing database, they aren't a 1-to-1 match. The REST layer provides access controls, hiding sensitive fields, blocking access to elements the user shouldn't be able to see, and preventing changes they shouldn't be allowed to make. GET requests return JSON objects, but they can return JSON objects which contain lists or maps, including lists or maps of foreign keys, instead of needing to be simple flat data. However, fields containing other structured objects is not supported. If this is needed, those objects should go in their own collection, with denormalized foreign keys.

Foreign keys that reference other collections take the form of the URL that would be used to request that element. This is important: The client should never have to construct a URL, except to add query parameters to the end. There will simply be one hardcoded URL associated with the `bootstrap` endpoint which will serve as the entry point into the entire REST graph.

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

While the Models, and the REST endpoints in general, may not have a 1-to-1 mapping to the database, all of the data display and manipulation done through them is drawing from or committing to the database, and thus while the models themselves may be shared, the code to manipulate those models must live on the server.
 
The `server/managers` folder contains a file for each model. Each of these exports one class, which contains methods for getting, changing or deleting these models. The manager thus serves as the interface between the structure of the REST endpoints and the structure of the database.

Note that the managers do not do any access control. That is religated to the REST endpoints themselves. By the time the manager is executing, it's assumed it has permission to do whatever it's being asked to do.

## Client

The client application uses [React](https://reactjs.org/) for the presentation, and [Redux](https://redux.js.org/) for the data store. The combination of these two technologies, with TypeScript and TSX, is a very standard workflow, and can be found documented in dozens of places.

All of the React components are located in `client/components`. All of the Redux actions are in `client/actions` and it's reducers are in `client/reducers`. The root of the app is in `client/App.ts`. This sets up the Redux store, creates and reifies the React tree, and kicks off the initial network requests that will populate the app with data.

The one slightly non-standard element is that actual models are stored in the Redux store, even though they have member functions. These models are treated as immutable, and are replaced if they change, so this doesn't actually undermine any of the normal guarantees of Redux.

### REST

REST requests are handled entirely through the models. In the `client/network` folder are a series of modules that each export a function, each of which will be passed a `Network`, one or more models, and possibly some additional data, and will kick off some appropriate network requests, and dispatch the results into the Redux store.
