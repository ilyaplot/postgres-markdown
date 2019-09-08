---
# Database Documentation

---
Создано: 2019-09-08T14:41:48.270Z
Версия сервера: PostgreSQL 10.10, compiled by Visual C++ build 1800, 64-bit
## Схема: users

### Таблицы

#### users.user


Дочерние таблицы:


 - [web_users.user](#web_users.user)

колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения
--- | --- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('users.user_id_seq'::regclass) | NOT NULL | 
email | Уникальный email пользователя (логин) | character varying | 100 |  | NOT NULL | 

## Схема: web_users

### Таблицы

#### web_users.user

колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения
--- | --- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('users.user_id_seq'::regclass) | NOT NULL | 
email *наследовано от [users.user](#users.user)* | Уникальный email пользователя (логин) | character varying | 100 |  | NOT NULL | 
settings | Массив int флагов | integer[] |  |  |  | 
status | Статус кользователя NEW - новый, CLOSED - закрытый  Статусы указаны для примера | web_users.test_enum |  |  |  | NEW, CLOSED
