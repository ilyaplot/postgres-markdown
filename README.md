# Postgres Markdown
> Builds Slate compatible markdown from a Postgres connection

## Usage:
```
Usage: postgres-markdown [options]


  Options:

    -V, --version              output the version number
    -h, --host [host]          Host
    -p, --port [port]          Port
    -d, --database [database]  Database
    -u, --user [user]          User
    -W, --password [password]  Password
    -o, --output [output]      Output file name
    -l, --locale [locale]      Documentation language (en|ru)
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

COMMENT ON COLUMN web_users."user".status IS 'Статус кользователя
NEW - новый, CLOSED - закрытый

Статусы указаны для примера';
```

## Example output:

---
# Database Documentation

---
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
status | Статус кользователя NEW - новый, CLOSED - закрытый  Статусы указаны для примера | user-defined |  |  |  | NEW, CLOSED
