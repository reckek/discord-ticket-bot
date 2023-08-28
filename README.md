## Description
Ticket bot

## For start
### Installation

```bash
$ npm install
$ yarn
$ pnpm install
```
### First steps
1. Create `env` file. Show in `example.env`
2. Insert environment data.
3. Run command for create db:
```bash
$ docker compose up
```
4. Insert data in fields for login from `.env`
    1. `DB_NAME -> db name`
    2. `DB_USERNAME -> login`
    3. `DB_PASSWORD -> password`

### Running the app

```bash
# development
$ npm run start
$ yarn run start
$ pnpm run start

# development with watch mode
$ npm run start:dev
$ yarn run start:dev
$ pnpm run start:dev

# production mode
$ npm run start:prod
$ yarn run start:prod
$ pnpm run start:prod
```
