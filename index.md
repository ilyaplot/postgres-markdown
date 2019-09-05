---
# Описание базы данных

---
Создано: 2019-09-05T20:29:03.716Z
Версия сервера: PostgreSQL 10.10, compiled by Visual C++ build 1800, 64-bit
## Схема: public

### Таблицы

#### public.test

колонка | комментарий | тип | длина | по-умолчанию | значения
--- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('test_id_seq'::regclass) | 
text | Колонка, содержащая какой-то текст  вот | character varying | 192 |  | 

#### public.test2

колонка | комментарий | тип | длина | по-умолчанию | значения
--- | --- | --- | --- | --- | ---
**id** _(pk)_ |  | integer |  | nextval('test_id_seq'::regclass) | 
text |  | character varying | 192 |  | 
array_column |  | array |  |  | 
