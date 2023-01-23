Project 2: Database Driven Sites
=======================================

## Quick Start

Execute the `quickstart` script command:

```
npm run quickstart
```

Or, execute each of the following commands:

```
cp .env.example .env
sed -i \"s/REPLACE_ME/$(whoami)/g\" .env
npm install
npm run db:reset
```

## Documentation

- For PostgreSQL v14 database:
    - PostgreSQL database client for Node.js: https://node-postgres.com/
    - v14 PostgreSQL API and Guides: https://www.postgresql.org/docs/14/index.html

- For Express.js v4 web framework for Node.js:
    - Basic Routing: https://expressjs.com/en/starter/basic-routing.html
    - In-depth Routing: https://expressjs.com/en/guide/routing.html
    - v4 API Reference: https://expressjs.com/en/4x/api.html

## Tasks

### Task 1: Add a VIN column to Cars Table

Open the `src/reset.js` file and add the following code after `//TODO-Task-1.1`:

```js
await db.query(`
  ALTER TABLE cars
  ADD COLUMN vin varchar(17) DEFAULT NULL;
`);
```

Then, update the cars insertion code at `//TODO-Task-1.2`:

```js
"INSERT INTO cars(year, make, model, vin) VALUES($1, $2, $3, $4)",
[car.year, car.make, car.model, car.vin]
```

Run the reset script (`npm run db:reset`) and verify the output in DBeaver.

### Task 2: Create the owners table

Open the `src/reset.js` file and add the following code after `//TODO-Task-2.1`:

```js
await db.query(`
  CREATE TABLE owners(
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL
  );
`);
```

Then, add a loop to insert each owner into the table after `//TODO-Task-2.2`:

```js
for (const owner of owners) {
  // What goes here? Look at the other for-loop as an example
}
```

### Task 3: Add owner foreign key to cars

Open the `src/reset.js` file and add the following code after `//TODO-Task-3.1`:

```js
await db.query(`
  ALTER TABLE cars
  ADD CONSTRAINT fk_cars_owners FOREIGN KEY (owner_id) REFERENCES owners (id);
`);
```

Then, update the cars insertion code at `// TODO-Task-3.2`:

```js
"INSERT INTO cars(year, make, model, vin, owner_id) VALUES($1, $2, $3, $4, $5)",
[car.year, car.make, car.model, car.vin, car.ownerId]
```

### Task 4: Add new GET endpoint /owners

Open the `src/server.js` file and add the following code after `// TODO-Task-4.1`:

```js
app.get('/owners', async (req, res) => {
  // TODO-Task-4.2: Lookup owners from database and return as JSON response
})
```

This allows your Node.js server to handle HTTP requests `GET /owners`.

Then, add code to do a SQL SELECT statement to list all the owners, and return
resulting rows to the browser as JSON data (i.e. JavaScript-Object-Notation with
`res.json(...)`) after `// TODO-Task-4.2`.

NOTE: You can copy the contents from `app.get('/', ...)` endpoint as the starting point.

### Task 5: Add new GET endpoint /cars-with-owners

Open the `src/server.js` file and add code to support a `/cars-with-owners`
endpoint after `//TODO-Task-5.1`.

Next, update the SQL query in `/cars-with-owners` endpoint to perform a `LEFT
JOIN` between `cars` and `owners` and return the resulting rows as JSON.

Run the server, hit your new `/cars-with-owners` endpoint and confirm it is
correct. Post a screenshot of the browser in Slack.

### Task 6: Add example HTML cars page

Open the `src/server.js` file and add the following code to support a
`/cars-html` endpoint after `//TODO-Task-6.1`.

```js
app.get("/cars-html", async (req, res) => {
  const result = await db.query("select * from cars;");

  // NOTE: By default, calling `res.send(...)` with a string tells the server "send this string to browser as HTML"
  // See docs here: https://expressjs.com/en/4x/api.html#res.send
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cars | Project 2</title>
      </head>
      <body>
        <main style="max-width: 800px; margin-left: auto; margin-right: auto;">
          <h1>Cars</h1>
          <ol>${result.rows.map(r => (`<li>${r.year} ${r.make} ${r.model}</li>`)).join('')}</ol>
          <h3>Add a new Car</h3>
          <form method="POST" action="/car">
            <label>
              Year
              <input type="number" name="year" />
            </label>
            <label>
              Make
              <input type="text" name="make" />
            </label>
            <label>
              Model
              <input type="text" name="model" />
            </label>
            <button>Submit</button>
          </form>
        </main>
      </body>
    </html>
  `);
});
```

Now, go read up on HTML forms as a quick refresher:

- https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form
- https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data

### Task 7: Add new POST endpoint to create cars

You will remember that a standard `GET` HTTP request looks something like this:

```
HTTP GET http://www.appdomain.com/users
HTTP GET http://www.appdomain.com/users?size=20&page=5
HTTP GET http://www.appdomain.com/users/123
HTTP GET http://www.appdomain.com/users/123/address
...etc
```

That `GET` between `HTTP` and the URL is one of many "HTTP Methods" than can be
sent. Other common requests look like this:

```
HTTP GET http://www.appdomain.com/users
HTTP POST http://www.appdomain.com/users
HTTP DELETE http://www.appdomain.com/users/123
HTTP PUT http://www.appdomain.com/users/123/address
...etc
```

You will notice in the above example that the `GET` and `POST` lines are using
the same URL. Even though they are hitting the same URL, the web server that
receives the request may handle the `GET` and `POST` requests _completely differently_
because the method/verb used are different.

All basic web applications that manage data must fulfill at least the basic "CRUD"
functionality:

  - (C)reate
  - (R)ead
  - (U)pdate
  - (D)elete

In well-designed web server applications, the different operations are performed
using _distinct HTTP methods_.

  - Create: `POST`
  - Read: `GET`
  - Update: `PUT` and/or `PATCH`
  - Delete: `DELETE`

For this task, we will start by supporting a **Create** action using an `HTTP
POST` method. You can read more about HTTP methods and Status Codes here:

  - https://restfulapi.net/http-methods/
  - https://www.restapitutorial.com/httpstatuscodes.html

Open the `src/server.js` file and add the following code to support a
`POST /car` endpoint after `//TODO-Task-7.1`.

```js
// NOTE: `app.post(...)` means "I only want to handle HTTP POST requests here"
// while `app.get(...)` means "I only want to handle HTTP GET requests here"
app.post('/car', async (req, res) => {
  // Read the HTTP request body which should contain the form data submitted by
  // the browser.
  // NOTE: See docs here: https://expressjs.com/en/4x/api.html#req.body
  const formData = req.body

  console.log('Form Data:', formData) // this is for our own debugging...

  // TODO-Task-7.2: Write an INSERT statement to save the data into the database

  // Redirect the browser back to the `/cars-html` page, which is what you want to do
  // when responding to a browser HTML form submission.
  // NOTE: See docs here: https://expressjs.com/en/4x/api.html#res.redirect
  res.redirect('/cars-html')

  // NOTE: If we were handling a programmatic API submission (like from a
  // JavaScript or mobile app), we could have instead returned an HTTP 201 status
  // code indicating "Successfully Created" and some JSON message like so:
  //
  // res.status(201).json({message: "Success!"});

  // NOTE: Learn more about status codes here: https://www.restapitutorial.com/httpstatuscodes.html
})
```

Then, create a database `INSERT` query to save the car form data into the
database after `//TODO-Task-7.2`.

Refer to the `./src/db.js` file for examples on writing `INSERT` queries.

### Task 8: Demo to manager

Run the server and demonstrate the HTML page displaying cars and inserting new cars with the form submission.
