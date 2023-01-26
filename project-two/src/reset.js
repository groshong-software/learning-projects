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


await db.query(`
  ALTER TABLE cars
  ADD COLUMN vin varchar(17) DEFAULT NULL;
`);
await db.query(`
  ALTER TABLE cars
  ADD COLUMN owner_Id integer DEFAULT NULL;
`);

await db.query(`
  CREATE TABLE owners(
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL
  );
`);

await db.query(`
  ALTER TABLE cars
  ADD CONSTRAINT fk_cars_owners FOREIGN KEY (owner_id) REFERENCES owners (id);
`);
await db.query(`
    ALTER TABLE owners
    ADD COLUMN last_name varchar(17) DEFAULT NULL;
`);
const owners = [
  { id: 1, name: "Bob", last_name: "Saget" },
  { id: 2, name: "Jim", last_name: "Halpert" },
  { id: 3, name: "Jib", last_name: "redNeckPressure" },
  { id: 4, name: "Dylan", last_name: "Perkins" },
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
  {
    year: 2016,
    make: "Mazda",
    model: "6",
    vin: "5GYSUAH67HDYG63I8",
    ownerId: 4,
  }
];


for (const owner of owners) {
  await db.query("INSERT INTO owners(id, name, last_name) VALUES ($1, $2, $3)", [owner.id, owner.name, owner.last_name]);
};
// Insert cars into cars table
for (const car of cars) {
  console.log("Inserting car:", car);
  await db.query(
    "INSERT INTO cars(year, make, model, vin, owner_id) VALUES($1, $2, $3, $4, $5)",
    [car.year, car.make, car.model, car.vin, car.ownerId]
  );
};

// Print the progress of our work
console.log(`Done inserting ${cars.length} cars.`);

// Test the cars table
const result = await db.query("select * from cars;");
console.log("Table now contains:");
console.log(result.rows);

db.end();
