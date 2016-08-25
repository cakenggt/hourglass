# Hourglass

Hourglass is a TimeSheet application that can be used to register jobs and track how much to invoice for those jobs.

Some features:
* Columns on the TimeSheet and Jobs pages are sortable and reverse-sortable by clicking on the yellow headers.
* Fax-tastic invoice design!
* The invoice can be printed off without the surrounding page by clicking the printer icon on the Invoice page.

## Setup

Run the npm install script to install all dependencies.

`npm install`

There must be a PostgreSQL db available for the backend. The url with the login credentials pointing to this db will be made available in the credentials file.

The url for the db should be in the following format:

`postgres:username:password@localhost:5432/hourglass`

There must be a file in the root directly called `credentials.js`. This file should export the following properties:
* `DATABASE_URL` The url of the PostgreSQL database. This should include the username and password to access the db.
* `TEST_DATABASE_URL` The url of the test PostgreSQL database. This is only needed if running tests.
* `PORT` What port the server will run on.

Run the start command to build the scripts and deploy the app.

`npm start`

You can then access the app by going to `localhost:PORT` where `PORT` is the one you specified in the credentials file.
