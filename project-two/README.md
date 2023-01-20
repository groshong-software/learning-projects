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

For the PostgreSQL database client: https://node-postgres.com/

For Express.js web framework: https://expressjs.com/

## Tasks

### Task 1: Add a VIN column to Cars Table

Open the `src/reset.js` file and add the following code after `//TODO-Task-1.1`:

```
await db.query(`
  ALTER TABLE cars
  ADD COLUMN vin varchar(17) DEFAULT NULL;
`);
```

Then, update the cars insertion code at `//TODO-Task-1.2`:

```
"INSERT INTO cars(year, make, model, vin) VALUES($1, $2, $3, $4)",
[car.year, car.make, car.model, car.vin]
```

Run the reset script (`npm run db:reset`) and verify the output in DBeaver.

### Task 2: Create the owners table

Open the `src/reset.js` file and add the following code after `//TODO-Task-2.1`:

```
await db.query(`
  CREATE TABLE owners(
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL
  );
`);
```

Then, add a loop to insert each owner into the table `//TODO-Task-2.2`:

```
for (const owner of owners) {
  console.log("Inserting owner:", owner);
  await db.query(
    "INSERT INTO owners(id, name) VALUES($1, $2)",
    [owner.id, owner.name]
  );
}
```

### Task 3: Add owner foreign key to cars

Open the `src/reset.js` file and add the following code after `//TODO-Task-3.1`:

```
await db.query(`
  ALTER TABLE cars
  ADD CONSTRAINT fk_cars_owners FOREIGN KEY (owner_id) REFERENCES owners (id);
`);
```

Then, update the cars insertion code at `//TODO-Task-3.2`:

```
"INSERT INTO cars(year, make, model, vin, owner_id) VALUES($1, $2, $3, $4, $5)",
[car.year, car.make, car.model, car.vin, car.ownerId]
```
