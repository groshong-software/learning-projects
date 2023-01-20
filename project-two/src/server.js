import express from "express";
import { db } from "./db.js";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const result = await db.query("select * from cars;");
  res.json(result.rows);
});

app.listen(port, () => {
  console.log(`Project-2 app listening on port ${port}`);
});
