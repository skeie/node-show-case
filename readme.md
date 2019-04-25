## About

This is an example graphql backend for a fitness app, to be used together with https://github.com/skeie/rn-show-case.
The app has limited seed data, so you'd have to add this yourself.

## Getting Started

1. Download & Install Dependencies

- [Install Node.js (Mac)](https://nodejs.org/en/download/)
- [Install Postgres (Mac)](https://www.postgresql.org/download/macosx/)

  ```sh
  # Install dependencies
  $ yarn
  $ createdb node_showcase && createdb node_showcase_test
  $ yarn run migrate:up
  $ yarn run migrate:up:test
  ```

  ```sh
  $ yarn start
  $ open http://localhost:3000/graphql
  ```

## Resources

- [Apollo Server](https://www.apollographql.com/)
- [GraphQL](https://graphql.org/)
- [DB Cheatsheet](https://gist.github.com/apolloclark/ea5466d5929e63043dcf)
- [DB Cheatsheet 2](https://gist.github.com/Kartones/dd3ff5ec5ea238d4c546)

## Testing

```sh
yarn run test:unit
yarn run test:integration

# update snapshots
SNAPSHOT_UPDATE=1 yarn run test:integration
```

## Database

create migration:

```sh
yarn run migrate create <name> --sql-file
```

Sometimes we change current migrations instead of adding new ones. In that case:

```sh
yarn resetdb
```

### /schemas

This is where we have our graphql schema types layed out.
We also define entry points for the query resolvers and mutations

### /app/<name>Queries

This is where we put our query resolvers. It should use StoreDataSources to manipulate the database, and DataSources to call external services

### /app/<name>Mutations

This is where we put our mutations. It should use StoreDataSources to manipulate the database, and DataSources to call external services

### /app/<name>StoreDataSource

This is where we manipulate the database

### /app/<name>DataSource

This is where we call external services

### /app/<name>Reducers

This is where we serialize data from the StoreDataSources
