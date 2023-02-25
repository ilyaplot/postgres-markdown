# Postgres Markdown
> Builds markdown from a Postgres connection

## Installation:
```
npm install -g postgres-markdown
```


## Usage:
```
Usage: postgres-markdown [options]

Options:
  -V, --version              output the version number
  -H, --host [host]          Host (default: "127.0.0.1")
  -p, --port [port]          Port (default: 5432)
  -u, --user [user]          User (default: "postgres")
  -W, --password [password]  Password
  -d, --database [database]  Database (default: "postgres")
  -o, --output [output]      Output file name (default: "index.md")
  -l, --locale [locale]      Locale (default: "ru")
  -i, --ignore <ignore>      Pattern of objects to ignore
  -v, --verbose              Verbose output
  -h, --help                 output usage information

```

## Example DB: 

```sql
CREATE SCHEMA users;
COMMENT ON SCHEMA users
  IS 'Пользователи';
  
CREATE TABLE users."user"
(
  id serial NOT NULL,
  email character varying(100) NOT NULL,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_email_key UNIQUE (email)
);

COMMENT ON COLUMN users."user".email IS 'Уникальный email пользователя (логин)';

CREATE TYPE web_users.test_enum AS ENUM
   ('NEW',
    'CLOSED');

CREATE TABLE web_users."user"
(
  settings integer[],
  status web_users.test_enum,
  CONSTRAINT user_pkey PRIMARY KEY (id)
)
INHERITS (users."user");

COMMENT ON COLUMN web_users."user".settings IS 'Массив int флагов';

COMMENT ON COLUMN web_users."user".status IS 'Статус пользователя
NEW - новый, CLOSED - закрытый

Статусы указаны для примера';
```

## Example output:

# Database Documentation

Created at: 2019-09-08T14:32:51.401Z
Server version: PostgreSQL 10.10, compiled by Visual C++ build 1800, 64-bit
## Schema: users

### Tables

#### users.user


Inherited tables:


 - [web_users.user](#web_users.user)

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('users.user_id_seq'::regclass) | NOT NULL | 
email | Уникальный email пользователя (логин) | character varying | 100 |  | NOT NULL | 

## Schema: web_users

### Tables

#### web_users.user

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('users.user_id_seq'::regclass) | NOT NULL | 
email *inherits from [users.user](#users.user)* | Уникальный email пользователя (логин) | character varying | 100 |  | NOT NULL | 
settings | Массив int флагов | integer[] |  |  |  | 
status | Статус пользователя NEW - новый, CLOSED - закрытый  Статусы указаны для примера | user-defined |  |  |  | NEW, CLOSED
