import express from "express";
import { db } from "./db.js";

const port = 3000;
const app = express();

// This allows parsing `application/x-www-form-urlencoded` data submitted by browser forms
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
  const result = await db.query("select * from cars left join owners on cars.owner_id = owners.id;");
  const ownerResult = await db.query("select * from owners");
  // TODO-Task-6.1: Replace with example HTML cars page
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
      <ol>
      ${result.rows
      .map((r) => `<li>${r.year} ${r.make} ${r.model} ${r.vin} ${r.name}</li>`)
      .join("")}
      </ol>      <h3>Add a new Car</h3>
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
        <label>
          VIN
          <input type="text" name="vin" />
        </label>
        <label>
          Owner ID
          <select name="owner_id">
          ${ownerResult.rows
      .map((r) => `<option value="${r.id}">${r.name}</option>`)}
          </select>
        </label>
        <button>Submit</button>
      </form>
    </main>
  </body>
</html>
`);
});

// TODO-Task-4.1: Add new GET endpoint /owners
app.get('/owners', async (req, res) => {
  const result = await db.query("select * from owners;");
  res.json(result.rows);
})
// TODO-Task-5.1: Add new GET endpoint /cars
app.get('/cars', async (req, res) => {
  const result = await db.query("select * from cars left join owners on cars.owner_id = owners.id;");
  res.json(result.rows);
})
// TODO-Task-7.1: Add new POST endpoint /car
// NOTE: `app.post(...)` means "I only want to handle HTTP POST requests here"
// while `app.get(...)` means "I only want to handle HTTP GET requests here"
app.post('/car', async (req, res) => {
  // Read the HTTP request body which should contain the form data submitted by
  // the browser.
  // NOTE: See docs here: https://expressjs.com/en/4x/api.html#req.body
  const formData = req.body

  console.log('Form Data:', formData) // this is for our own debugging...

  // TODO-Task-7.2: Write an INSERT statement to save the data into the database
  await db.query(
    "INSERT INTO cars(year, make, model, vin, owner_id) VALUES($1, $2, $3, $4, $5)",
    [formData.year, formData.make, formData.model, formData.vin, formData.owner_id]
  )
  // Redirect the browser back to the `/cars-html` page, which is what you want to do
  // when responding to a browser HTML form submission.
  // NOTE: See docs here: https://expressjs.com/en/4x/api.html#res.redirect
  res.redirect('/')

  // NOTE: If we were handling a programmatic API submission (like from a
  // JavaScript or mobile app), we could have instead returned an HTTP 201 status
  // code indicating "Successfully Created" and some JSON message like so:
  //
  //
  // res.status(201).json({message: "Success!"});
  //
  //
  // Learn more about status codes here: https://www.restapitutorial.com/httpstatuscodes.html
})
app.listen(port, () => {
  console.log(`Project-2 app listening on port ${port}`);
});
