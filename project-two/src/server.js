import express from "express";
import { db } from "./db.js";

const port = 3000;
const app = express();

// This allows parsing `application/x-www-form-urlencoded` data submitted by browser forms
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
  const result = await db.query("select * from cars;");
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

app.get('/owners', async (req, res) => {
  const result = await db.query("select * from owners;");
  res.json(result.rows)
})

app.get('/cars', async (req, res) => {
  const result = await db.query("Select * from cars Left Join owners on cars.owner_id = owners.id;");
  res.json(result.rows)
})
// NOTE: `app.post(...)` means "I only want to handle HTTP POST requests here"
// while `app.get(...)` means "I only want to handle HTTP GET requests here"
app.post('/car', async (req, res) => {
  // Read the HTTP request body which should contain the form data submitted by
  // the browser.
  // NOTE: See docs here: https://expressjs.com/en/4x/api.html#req.body
  const formData = req.body

  console.log('Form Data:', formData) // this is for our own debugging...

  // TODO-Task-7.2: Write an INSERT statement to save the data into the database
  await db.query("INSERT INTO cars()")
  // Redirect the browser back to the `/cars-html` page, which is what you want to do
  // when responding to a browser HTML form submission.
  // NOTE: See docs here: https://expressjs.com/en/4x/api.html#res.redirect
  res.redirect('/cars-html')

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
