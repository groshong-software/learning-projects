import { db } from "./db.js";

// Delete any past tables
await db.query(`
  DROP TABLE IF EXISTS cars;
  DROP TABLE IF EXISTS owners;
`);

// Create the "cars" table
await db.query(`
  CREATE TABLE cars(
    id serial PRIMARY KEY,
    year integer NOT NULL,
    make varchar(40) NOT NULL,
    model varchar(40) NOT NULL
  );
`);

// TODO-Task-1.1: Add VIN column to cars table

// TODO-Task-2.1: Create the owners table

// TODO-Task-3.1: Add ownerId foreign key to cars table

const owners = [
  { id: 1, name: "Bob" },
  { id: 2, name: "Jim" },
];

const cars = [
  {
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    vin: "1J4FY29S9SP248626",
    ownerId: 1,
  },
  {
    year: 2019,
    make: "Hyundai",
    model: "Elantra",
    vin: "1FUJGEBG9B5A82867",
    ownerId: 1,
  },
  {
    year: 2008,
    make: "Toyota",
    model: "Highlander",
    vin: "5UXWX5C56CL708569",
    ownerId: 2,
  },
];

// TODO-Task-2.2: Insert owners into owners table

// Insert cars into cars table
for (const car of cars) {
  console.log("Inserting car:", car);
  await db.query(
    // TODO-Task-1.2 add vin column data
    // TODO-Task-3.2 add ownerId foreign key data
    "INSERT INTO cars(year, make, model) VALUES($1, $2, $3)",
    [car.year, car.make, car.model]
  );
}
// Print the progress of our work
console.log(`Done inserting ${cars.length} cars.`);

// Test the cars table
const result = await db.query("select * from cars;");
console.log("Table now contains:");
console.log(result.rows);

db.end();
