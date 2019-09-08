---
# Database Documentation

---
Created at: 2019-09-08T15:04:34.376Z
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
status | Статус кользователя NEW - новый, CLOSED - закрытый  Статусы указаны для примера | web_users.test_enum |  |  |  | NEW, CLOSED
