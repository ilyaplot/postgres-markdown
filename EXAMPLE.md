# Database Documentation

Создано: 2023-02-25T19:53:16.025Z
Версия сервера: PostgreSQL 15.2 (Debian 15.2-1.pgdg110+1) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
## Схема: public

### Таблицы

## Схема: users

### Таблицы

#### users.user


Дочерние таблицы:


 - [web_users.user](#web_users-user)

| колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения |
| ------- | ----------- | --- | ----- | ------------ | ----------- | -------- |
| **id** _(pk)_ |  | integer |  | nextval('users.user_id_seq'::regclass) | NOT NULL, [user_email_key](#users.user), [user_pkey](#users.user) |  |
| email | Уникальный email пользователя (логин) | character varying | 100 |  | NOT NULL, [user_email_key](#users.user), [user_pkey](#users.user) |  |

## Схема: web_users

### Таблицы

#### web_users.user

| колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения |
| ------- | ----------- | --- | ----- | ------------ | ----------- | -------- |
| **id** _(pk)_ |  | integer |  | nextval('users.user_id_seq'::regclass) | NOT NULL, [user_pkey](#web_users.user) |  |
| email |  | character varying | 100 |  | NOT NULL, [user_pkey](#web_users.user) |  |
| settings | Массив int флагов | integer[] |  |  | NOT NULL, [user_pkey](#web_users.user) |  |
| status | Статус кользователя NEW - новый, CLOSED - закрытый  Статусы указаны для примера | web_users.test_enum |  |  | NOT NULL, [user_pkey](#web_users.user) | NEW, CLOSED |
