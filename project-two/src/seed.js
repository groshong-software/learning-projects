import { db } from "./db.js";

// Create the "cars" table
await db.query(`
CREATE TABLE IF NOT EXISTS cars(
  id serial PRIMARY KEY,
  year integer NOT NULL,
  make varchar(40) NOT NULL,
  model varchar(40) NOT NULL
);
`);

const cars = [
  { year: 2022, make: "Toyota", model: "Corolla" },
  { year: 2019, make: "Hyundai", model: "Elantra" },
  { year: 2008, make: "Toyota", model: "Highlander" },
];

for (const car of cars) {
  console.log("Inserting car:", car);
  await db.query(
    "INSERT INTO cars(year, make, model) VALUES($1, $2, $3) RETURNING *",
    [car.year, car.make, car.model]
  );
}

console.log(`Done inserting ${cars.length} cars.`);

const result = await db.query("select * from cars;");

console.log("Table now contains:");
console.log(result.rows);

db.end();
