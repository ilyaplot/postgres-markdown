---
title: Документация БД

search: true
---

# Таблицы

## _dmdmdmd

```
Таблица с наследованием
```

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('_dmdmdmd_id_seq'::regclass) | NOT NULL | 
test_id |  | integer |  |  | NOT NULL, [test_id](#test) | 

## supertest

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('test_id_seq'::regclass) | NOT NULL | 
text |  | character varying | 105 | 'dval' | NOT NULL | 
enum | Enum поле | user-defined |  |  |  | ONE, TWO, THREE

## test

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('test_id_seq'::regclass) | NOT NULL | 
text | Колонка с   текстом и многострочным комментарием | character varying | 105 | 'dval' | NOT NULL | 

# Представления

## comedies

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
id |  | integer |  |  |  | 
text |  | character varying | 105 |  |  | 

## comedies2

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
id |  | integer |  |  |  | 
text |  | character varying | 105 |  |  | 
country |  | character varying | 105 |  |  | 
avg_rating |  | numeric |  |  |  | 

## vista

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
?column? |  | text |  |  |  | 

## vista2

column | comment | type | length | default | constraints | values
--- | --- | --- | --- | --- | --- | ---
hello |  | text |  |  |  | 

# Роли

name | super user | inherits | create role | create database | can login | bypass RLS | connection limit | configuration | roles granted
--- | --- | --- | --- | --- | --- | --- | --- | --- | ---
pg_signal_backend | false | true | false | false | false | false | -1 |  | 
postgres | true | true | true | true | true | true | -1 |  | 
pg_read_all_stats | false | true | false | false | false | false | -1 |  | {pg_monitor}
pg_monitor | false | true | false | false | false | false | -1 |  | 
pg_read_all_settings | false | true | false | false | false | false | -1 |  | {pg_monitor}
pg_stat_scan_tables | false | true | false | false | false | false | -1 |  | {pg_monitor}

# Расширения

name | version | description
--- | --- | ---
plpgsql | 1.0 | PL/pgSQL procedural language

  