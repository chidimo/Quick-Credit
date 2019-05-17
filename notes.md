# Personal notes

## To compile async/await with babel

```
yarn add @babel/runtime 
yarn add -D @babel/plugin-transform-runtime
```

```
# .bablerc
"plugins": [
        ["@babel/transform-runtime"]
    ]
```

## Configure postres for mocha test

1. Add `C:\Program Files\PostgreSQL\11\bin` environment path. This allows `psql` to run
1. `psql -U postgres` connect to database `postgres`. It might ask for password
1. `psql -d <db-name> -f dump.sql -U postgres` dump data in `dump.sql` into `db-name` table of `postgres` database
1. `createdb -U postgres <db-name>`. Create database `db-name` with user `postgres`
1. `psql -U postgres -c "drop database <db-name>"` drop database `db-name`


```sql
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    firstname VARCHAR DEFAULT '',
    lastname VARCHAR DEFAULT '',
    phone VARCHAR DEFAULT '',
    address jsonb DEFAULT '{"home": "", "office": ""}',
    status VARCHAR DEFAULT 'unverified',
    isAdmin BOOLEAN DEFAULT false
);

UPDATE users SET email='a@b.com' WHERE id=1

INSERT INTO users(email, password, firstname, lastname, phone, address)
VALUES ('a@b.com', 'password', 'first', 'men', '080121515', '{"home": "iyaba", "office": "ring road"}'),
       ('c@d.go', 'password', 'name', 'cat', '08151584151', '{"home": "london", "office": "NYC"}'),
       ('me@yahoo.com', 'password', 'tayo', 'dele', '08012345678', '{"home": "ijebu","office": "ijegun"}'),
       ('abc@gmail.com', 'password', 'what', 'is', '08012345678','{"home": "must","office": "not"}'),
       ('name@chat.co', 'password', 'niger', 'tornadoes', '08012345678', '{"home": "niger","office": "niger"}'),
       ('bcc@gmail.com', 'password', 'bcc', 'lions', '08012345678', '{"home": "gboko","office": "gboko"}'),
       ('bbc@bbc.uk', 'password', 'bbc', 'broadcast', '08012345678', '{"home": "london","office": "uk"}'),
       ('c@g.move', 'password', 'abc', 'def', '08012345678', '{"home": "shop","office": "home"}'),
       ('an@dela.ng', 'password', 'and', 'ela', '08012345678', '{"home": "ikorodu","office": "lagos"}'),
       ('soft@ware.eng', 'password', 'soft', 'eng', '08012345678', '{"home": "remote","office": "on-site"}');

CREATE TABLE loans (
	id SERIAL PRIMARY KEY,
	userid INT NOT NULL,
    createdon TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR DEFAULT 'pending',
    repaid BOOLEAN DEFAULT false,
    amount FLOAT NOT NULL,
    tenor INT NOT NULL,
    interest FLOAT NOT NULL,
    balance FLOAT NOT NULL,
    paymentinstallment FLOAT NOT NULL
);

-- remove status field for new items
-- replace userid field
INSERT INTO loans(userid, status, repaid, amount, tenor, interest, balance, paymentinstallment)
VALUES (1, 'approved', false, 50000, 12, 2500, 36999.35, 4375),
       (2, 'approved', true, 100000, 12, 5000, 0, 8750),
       (3, 'approved', false, 200000, 8, 10000, 200000, 26250),
       (4, 'approved', false, 25000, 12, 1250, 24500, 2187.5),
       (5, 'approved', false, 45000, 6, 2250, 26250, 7875),
       (6, 'pending', false, 80000, 12, 4000, 8000, 7000),
       (7, 'rejected', false, 60000, 6, 3000, 6000, 10500),
       (8, 'approved', false, 125000, 12, 6250, 20000, 10937.5),
       (9, 'rejected', false, 190000, 12, 9500, 19000, 16625),
       (10, 'pending', false, 1000000, 12, 50000, 0, 87500);

CREATE TABLE repayments (
    id SERIAL PRIMARY KEY,
    loanid INT NOT NULL,
    adminid INT NOT NULL,
    createdon TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    amount FLOAT NOT NULL,
)

INSERT INTO repayments(loanid, adminid, amount)
VALUES (1, 3, 4375),
      (1, 3, 4375),
      (2, 1, 4375),
      (1, 2, 4375),
      (3, 4, 2875),
      (5, 8, 4375),
      (4, 3, 4375),
      (8, 1, 4375),
      (8, 4, 4375),
      (10, 8, 4375)
```


#### What does this PR do?

Setup database and connect users model

#### Description of Task to be completed?

1. Create a model class from which all data models inherit (simplifies DB operations)
1. Create a global settings file to abstract the definition of DB connection parameters
1. Use `node-postgres` to establish a DB connection and to run SQL queries

#### How should this be manually tested?

1. Clone the repo
1. `cd` into the root folder on a `cmd` shell and run `yarn install`. PowerShell is fine also.
1. Setup a PostgreSQL DB.
1. Define a `.env` file in the root of the project and supply values for the following parameters
    ```.env
    JWT_SECRET=<json-web-token-secret>
    PGPASSWORD=<postgres-db-password>
    PGHOST=<postgres-db-host>
    PGUSER=<postgres-db-user>
    PGPORT=<postgres-db-port>
    ```
1. Create a PostgreSQL database called `testdb` and run the following command on it with pgadmin
```sql
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    firstname VARCHAR DEFAULT '',
    lastname VARCHAR DEFAULT '',
    phone VARCHAR DEFAULT '',
    address jsonb DEFAULT '{"home": "", "office": ""}',
    status VARCHAR DEFAULT 'unverified',
    isAdmin BOOLEAN DEFAULT false
);
```
1. Now run command `yarn test`

#### Any background context you want to provide?

Nil

#### What are the relevant pivotal tracker stories?

[165939712](https://www.pivotaltracker.com/story/show/165939712)

#### Screenshots (if appropriate)

Nil

#### Questions:

Nil


Stormy

#494E6B
#98878F
#985E6D
#192231

Corporate and sleek
#F7F5E6
#333A56
#52658F
#E8E8E8

Warm tones
#D7CEC7
#565656
#76323F
#C09F80

9AC1E6

```
router.get('/repayments', LoansController.get_all_repayments
);
```