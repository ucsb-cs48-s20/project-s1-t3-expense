# Deploy instructions for the Housing Expenses Splitter

## Prerequisites

- Node.js v10 or higher

- For installation advice, see: <https://ucsb-cs48.github.io/jstopics/node/>
## Before we get started
=Fork the project repo to your own personal GitHub account by clicking on the "Fork" button at the upper right hand of the repo's page on GitHub.  This creates a personal copy of the repo under your own GitHub account.  This is necessary because you can't deploy an app to Heroku unless you have admin access to the repo.

-Create a new Heroku app, and link it to you forked copy, so that you are ready to deploy the master branch
## Installing dependencies

Run the command:

```
npm install
```

Do this:

- The first time you clone this repo
- Any time you switch branches
- Any time you pull new changes from GitHub

Also make sure you run the following commands as well

*Not sure if the following commands are actually necessary, but I suppose doing them wouldn't hurt*
```
npm install mongoose
npm add semantic-ui-react
```
## Setting up MongoDb

You're gonna have to set up a database in MongoDB in order to store user data. Instructions on how to do this can be found here <https://ucsb-cs48.github.io/topics/mongodb_cloud_atlas_setup/>
Specifically, keep note of the Mongo URI string found at the end of step 10. You will need this later on to configure the .env file for localhost and subsequently the config vars for heroku.

## Obtaining Secrets

To work properly, this application must be configured to use Google
OAuth using the Auth0 service.

This involves:

- Setting up an Auth0 account (if you do not already have one)
- Configuring an application
- Copying the value of three "secrets" into a file called `.env`

All of these instructions can be found in this file (Don't worry about the fact that .env.SAMPLE isn't the same as the one in the instructions, this will be addressed later):
[docs/auth0-localhost.md](docs/auth0-localhost.md)

Follow _all_ of the instructions in that file _before_ continuing on to the next step.
At this point the only blank vars in your .env should be the following:

MONGODB_URI_PRODUCTION=

NODE_ENV=

Set MONGODB_URI_PRODUCTION to the uri string obtained from _Setting up MongoDB_ and set NODE_ENV to _production_
## Running on localhost

To run on localhost, you must first modify two files: pages/[id]/edit.js and pages/[id]/index.js
Change these bits of code from edit.js
from this (heroku set up)
![1st change to edit.js](./images/edit1heroku.png)
to this (localhost set up)
![1st change to edit.js](./images/edit1local.png)
and from this (heroku set up)
![2nd change to edit.js](./images/edit2heroku.png)
to this (localhost set up)
![2nd change to edit.js](./images/edit2local.png)

Change these bits of code from index.js
from this (heroku set up)
![1st change to index.js](./images/index1heroku.png)
to this (localhost set up)
![1st change to index.js](./images/index1local.png)
and from this (heroku set up)
![2nd change to index.js](./images/index2heroku.png)
to this (localhost set up)
![2nd change to index.js](./images/index2local.png)
Note: You must do this if you plan to first run in local host. This means that if you plan on deploying on heroku first, you can skip this step.

Execute the following command to run on localhost:

```
npm run dev
```

The app will run on <http://localhost:3000>.

While the app is running in development mode, any changes you make to
the codebase will automatically be reflected in the browser.

## Configuring secrets for GitHub Actions

If the test cases were passing on the starter code repo, but are now
failing, it is likely because you need to configure the secrets
for Github Actions. That process is explained here: [docs/auth0-github-actions.md](./docs/auth0-github-actions.md).

## Deployment to Production

At some point, you'll want to deploy your application to the public internet
so that real users can access it: we call this a _production_ deployment
of your app.

There are a variety of cloud-based platforms where we can deploy our
applications. The file [docs/platforms.md](./docs/platforms.md) describes
the pros/cons of Heroku vs. now.sh and Amazon Web Services. The summary
is that we've chosen Heroku for it's easy of user for beginners
and the ability for a team to collaborate on managing a deployment.

Before setting up heroku, assure that  the following two files: 
pages/[id]/edit.js and pages/[id]/index.js
are properly configured for heroku. All this means is that the code in these files match the images marked with (heroku set up) from the _Running on localhost_ section, with 1 modification. You must change
cs48-s20-s1-t3-prod.herokuapp.com
to the whatever the url of your heroku app is.
Further instructions for configuring your app for Heroku are listed in the file
[docs/heroku.md](./docs/heroku.md)

## The value of `SESSION_COOKIE_SECRET`

For deployments to localhost and now.sh, the value of `SESSION_COOKIE_SECRET` is automatically determined by the files `next.config.js` and `setup_now.js`, respectively.

For Heroku deployments, this value needs to be set by hand in the .env file.

The purpose of this value is described in the file [docs/session-cookie-secret.md](./docs/session-cookie-secret.md)
