# Sprint Planner Backend

This is the backend API for the Sprint Planner project. It is built using Node.js and PostgreSQL.

## Prerequisites

Before you can start the server locally, make sure you have the following:

- [Node.js](https://nodejs.org/) installed on your machine
- [PostgreSQL](https://www.postgresql.org/) installed on your machine
- An [Octa](https://developer.okta.com/signup/) account and create an app from the console

## Getting Started

1. Clone the repository from GitHub:

`git clone https://github.com/tech-university-india/sprint-planner-backend.git`

2. Move to the project root:

`cd sprint-planner-backend`

3. Create a `.env` file in the root directory and add the following fields as mentioned in `.env.example`.

4. Add a file `database/config/config.json` in the following format:

```
{
  "development": {
    "username": "username",
    "password": "password",
    "database": "sprint_planner_dev",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": 5433
  },
  "test": {
    "username": "username",
    "password": "password",
    "database": "sprint_planner_dev",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port": 5433
  }
}

```

5. Run the custom start script to install dependencies, run migrations and start the server

`npm start` <br /> <br />

##### The server will start on PORT 8080 of your local machine

### Refer to the following link for the postman API reference

<a name="Postman Reference" href="https://api.postman.com/collections/11754479-8e0e21eb-8162-47db-ba02-3f7950ea47ec?access_key=PMAT-01GVD64RDRQWSHHQM1NXBVYBGH">
Postman Collection
</a>
