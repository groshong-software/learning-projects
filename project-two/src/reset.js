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
await db.query(`
  ALTER TABLE cars
  ADD COLUMN vin varchar(17) DEFAULT NULL;
`);

await db.query(`
  ALTER TABLE cars
  ADD COLUMN owner_id integer DEFAULT NULL;
`);

// TODO-Task-2.1: Create the owners table
await db.query(`
  CREATE TABLE owners(
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL
  );
`);

// TODO-Task-3.1: Add ownerId foreign key to cars table
await db.query(`
  ALTER TABLE cars
  ADD CONSTRAINT fk_cars_owners FOREIGN KEY (owner_id) REFERENCES owners (id);
`);
const owners = [
  { id: 1, name: "Bob" },
  { id: 2, name: "Jim" },
  { id: 3, name: "Dylan" },
  { id: 4, name: "Alex" },
  { id: 5, name: "Clark" },
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
for (const owner of owners) {
  // What goes here? Look at the other for-loop as an example
  await db.query(
    "INSERT INTO owners(id, name) VALUES($1, $2)",
    [owner.id, owner.name]
  )
}
// Insert cars into cars table
for (const car of cars) {
  console.log("Inserting car:", car);
  await db.query(
    // TODO-Task-1.2 add vin column data
    // TODO-Task-3.2 add ownerId foreign key data
    "INSERT INTO cars(year, make, model, vin, owner_id) VALUES($1, $2, $3, $4, $5)",
    [car.year, car.make, car.model, car.vin, car.ownerId]
  );
}
// Print the progress of our work
console.log(`Done inserting ${cars.length} cars.`);

// Test the cars table
const result = await db.query("select * from cars;");
console.log("Table now contains:");
console.log(result.rows);

db.end();
