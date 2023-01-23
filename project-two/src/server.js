import express from "express";
import { db } from "./db.js";

const port = 3000;
const app = express();

// This allows parsing `application/x-www-form-urlencoded` data submitted by browser forms
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
  const result = await db.query("select * from cars;");

  // TODO-Task-6.1: Replace with example HTML cars page
  res.json(result.rows);
});

// TODO-Task-4.1: Add new GET endpoint /owners

// TODO-Task-5.1: Add new GET endpoint /cars

// TODO-Task-7.1: Add new POST endpoint /car

app.listen(port, () => {
  console.log(`Project-2 app listening on port ${port}`);
});
