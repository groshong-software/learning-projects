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
npm run db:seed
```

## Documentation

For the PostgreSQL database client: https://node-postgres.com/

For Express.js web framework: https://expressjs.com/
