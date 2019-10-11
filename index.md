# Database Documentation

Создано: 2019-09-27T15:06:50.033Z
Версия сервера: PostgreSQL 10.7 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 4.4.7 20120313 (Red Hat 4.4.7-23), 64-bit
## Схема: api

### Таблицы

#### api.aoc

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **aoc_id** _(pk)_ |  | integer |  | nextval('api.aoc_aoc_id_seq'::regclass) | NOT NULL | 
msisdn |  | bigint |  |  | NOT NULL | 
actions | Действия - запросы в API | jsonb |  |  | NOT NULL | 
commands | Действия абонента (отправка sms, ussd запрос, etc...) | jsonb |  |  | NOT NULL | 
state | Статус AOC. AWAITING - ожидает подтвержддения, ACCEPTED - принят, REJECTED - отклонен, REMOVED - удален | api.aoc_state |  | 'AWAITING'::api.aoc_state | NOT NULL | AWAITING, ACCEPTED, REJECTED, REMOVED
created_at |  | timestamp without time zone |  |  |  | 
updated_at |  | timestamp without time zone |  |  |  | 
expired_at |  | timestamp without time zone |  |  |  | 
request_id |  | character varying |  |  |  | 
type |  | api.aoc_type |  | 'PURCHASE'::api.aoc_type | NOT NULL | GIFT_SEND, GIFT_RECEIVE, CATCH, PURCHASE, HANGUP | 

#### api.billing_request_queue

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **request_id** _(pk)_ |  | bigint |  | nextval('api.billing_request_queue_request_id_seq'::regclass) | NOT NULL | 
state |  | api.billing_request_state |  |  | NOT NULL | QUEUED, AWAITING, EXECUTED, CANCELED, PROCESSING
msisdn |  | bigint |  |  | [msisdn](#subscriber.subscriber) | 
service_code |  | crm.service_code |  |  |  | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
action |  | api.billing_request_action |  |  | NOT NULL | ON, OFF
additional_data |  | jsonb |  | '{}'::jsonb |  | 
created_at |  | timestamp without time zone |  | now() |  | 
updated_at |  | timestamp without time zone |  | now() |  | 
showcase_call_id |  | integer |  |  |  | 
provisioning_request_id |  | character varying[] |  |  |  |  | 

#### api.call

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **request_id** _(pk)_ |  | bigint |  | nextval('api.call_call_id_seq'::regclass) | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
updated_at |  | timestamp without time zone |  | now() | NOT NULL | 
counter |  | integer |  | 0 | NOT NULL | 
error |  | json |  |  |  | 
request |  | json |  |  |  | 
type |  | api.call_type |  |  | NOT NULL | BILLING_ERROR, WAITING_FOR_CONFIRMATION, QUEUE
msisdn |  | bigint |  |  | NOT NULL | 
status |  | api.call_state |  | 'QUEUE'::api.call_state | NOT NULL | QUEUE, COMPLETED, ERROR, LOCKED | 

#### api.case

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **case_id** _(pk)_ |  | integer |  | nextval('api.case_case_id_seq'::regclass) | NOT NULL | 
comment |  | character varying |  |  |  | 
key |  | character varying | 36 |  | NOT NULL | 
data |  | json |  |  |  |  | 

#### api.showcase_call

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **showcase_call_id** _(pk)_ |  | integer |  | nextval('api.showcase_call_showcase_call_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL, [showcase_id](#cms.showcase) | 
uri |  | character varying |  |  | NOT NULL | 
params |  | jsonb |  |  |  | 
called_at |  | timestamp without time zone |  | now() | NOT NULL | 
msisdn |  | bigint |  |  | NOT NULL | 
active_services |  | crm.service_code[] |  |  |  |  | 

#### api.task_queue

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **task_queue_id** _(pk)_ |  | integer |  | nextval('api.task_queue_task_queue_id_seq'::regclass) | NOT NULL | 
method | Метод API | character varying |  |  | NOT NULL | 
params | Параметры запроса, передаваемые в теле запроса | jsonb |  |  |  | 
msisdn | Номер абонента, для которого выполняется запрос | bigint |  |  | NOT NULL | 
created_at | Дата добавления запроса в очередь | timestamp without time zone |  | now() | NOT NULL | 
updated_at | Дата последнего изменения состояния задачи | timestamp without time zone |  |  |  | 
attempt_counter | Счетчик попыток выполнения запроса | integer |  | 0 | NOT NULL | 
task_scheduler_id |  | integer |  |  | NOT NULL, [task_scheduler_id](#api.task_scheduler) | 
state | Статус выполнения задачи QUEUED - Добавлено в очередь, ожидает обработки планировщиком EXECUTED - Задача выполнена, ожидается ответ от биллинга FAILED - Выполнение задачи окончилось неудачей SUCCEED- Выполнение задачи успешно завершено AWAITING - Предыдущее выполнение была неуспешным, задача в ожидании на перевыполнение | api.task_state |  | 'QUEUED'::api.task_state | NOT NULL | QUEUED, EXECUTED, FAILED, SUCCEED, AWAITING
last_error_code | Код ошибки последней неудачной доставки | character varying |  |  |  | 
last_error_message |  | character varying |  |  |  |  | 

#### api.task_scheduler

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **task_scheduler_id** _(pk)_ |  | integer |  | nextval('api.task_scheduler_task_scheduler_id_seq'::regclass) | NOT NULL | 
created_at | Дата создания планировщика | timestamp without time zone |  | now() | NOT NULL | 
updated_at | Дата обновления параметров планировщика | timestamp without time zone |  |  |  | 
start_date | Дата начала работы планировщика | date |  |  | NOT NULL | 
end_date | Дата остановки планировщика | date |  |  | NOT NULL | 
task_per_day_limit | Ограничение на кол-во выполненных задач в день | integer |  |  |  | 
task_interval | Интервал между запросами в миллисекундах | integer |  |  |  | 
restricted_hours | Часы, в которые нельзя выполнять запросы | integer[] |  |  |  | 
restricted_week_days | Дни недели, в которые нельзя выполнять запросы | integer[] |  |  |  |  | 

## Схема: cms

### Таблицы

#### cms.artist

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **artist_id** _(pk)_ |  | integer |  | nextval('cms.artist_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  |  | 
additional_data |  | jsonb |  |  |  | 
uri |  | character varying |  |  |  | 
name_vector |  | tsvector |  |  |  | 
image_id |  | integer |  |  | [image_id](#cms.image) | 
latin_name |  | character varying |  |  |  | 
genre_id |  | integer |  |  | [genre_id](#content.genre) | 
content_provider_id | Контент провайдер | integer |  |  | NOT NULL, [content_provider_id](#content.provider) | 
is_deleted |  | boolean |  | false |  |  | 

#### cms.image

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **image_id** _(pk)_ |  | integer |  | nextval('cms.image_image_id_seq'::regclass) | NOT NULL | 
type |  | cms.image_type |  | 'default'::cms.image_type | NOT NULL | default, wide
uuid |  | uuid |  | uuid_generate_v4() |  | 
width |  | integer |  |  |  | 
height |  | integer |  |  |  | 
source_url |  | character varying |  |  |  |  | 

#### cms.permission

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **permission_id** _(pk)_ |  | integer |  | nextval('cms.permission_permission_id_seq'::regclass) | NOT NULL | 
title |  | character varying |  |  | NOT NULL | 
permission |  | character varying |  |  | NOT NULL | 
parent_permission_id |  | integer |  |  | [parent_permission_id](#cms.permission) |  | 

#### cms.publication

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **publication_id** _(pk)_ |  | integer |  | nextval('cms.publication_id_seq'::regclass) | NOT NULL | 
content_id |  | integer |  |  |  | 
service_code |  | crm.service_code |  |  |  | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
is_disabled |  | boolean |  | true | NOT NULL | 
showcase_id |  | integer |  |  | [showcase_id](#cms.showcase) | 
tariff_category_id |  | integer |  |  | [tariff_category_id](#cms.tariff_category) | 
code |  | character varying |  |  |  | 
is_deleted |  | boolean |  | false | NOT NULL | 
additional_data |  | jsonb |  |  |  | 
content_type |  | content.type |  |  |  | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
state |  | content.state |  | 'AWAITING'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
state_updated_at | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  |  | 

#### cms.publication_code

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **provider_prefix** _(pk)_ |  | character varying | 3 |  | NOT NULL | 
**last_code** _(pk)_ |  | integer |  |  | NOT NULL |  | 

#### cms.role

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **role_id** _(pk)_ |  | integer |  | nextval('cms.role_role_id_seq'::regclass) | NOT NULL | 
title |  | character varying |  |  | NOT NULL | 
role |  | character varying |  |  | NOT NULL |  | 

#### cms.role_permission

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **role_id** _(pk)_ |  | integer |  |  | NOT NULL, [role_id](#cms.role) | 
**permission_id** _(pk)_ |  | integer |  |  | NOT NULL, [permission_id](#cms.permission) |  | 

#### cms.showcase

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **showcase_id** _(pk)_ |  | integer |  | nextval('cms.showcase_id_seq'::regclass) | NOT NULL | 
type |  | cms.showcase_type |  |  |  | COMMON, IVR, WEB, USSD, SMS, CMS, BILLING, RBT, ADVERTISMENT
name |  | character varying |  |  | NOT NULL | 
cms_show |  | boolean |  | true | NOT NULL | 
additional_data |  | jsonb |  | '{}'::jsonb |  |  | 

#### cms.showcase_section

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **section_id** _(pk)_ |  | integer |  | nextval('cms.showcase_section_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | [showcase_id](#cms.showcase) | 
name |  | character varying |  |  |  | 
is_visible |  | boolean |  | false | NOT NULL | 
genre_id |  | integer |  |  | [genre_id](#content.genre) | 
additional_data |  | jsonb |  |  |  |  | 

#### cms.showcase_section_top

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **section_id** _(pk)_ |  | integer |  |  | NOT NULL, [section_id](#cms.showcase_section) | 
**publication_id** _(pk)_ |  | integer |  |  | NOT NULL, [publication_id](#cms.publication) | 
sort_order |  | integer |  |  |  |  | 

#### cms.sms_shortcode

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **sms_shortcode_id** _(pk)_ |  | integer |  | nextval('cms.sms_shortcode_sms_shortcode_id_seq'::regclass) | NOT NULL | 
short_number |  | character varying | 10 |  | NOT NULL | 
shortcode |  | character varying | 10 |  |  | 
publication_code |  | character varying | 10 |  | NOT NULL |  | 

#### cms.tariff_category

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **tariff_category_id** _(pk)_ |  | integer |  | nextval('cms.tariff_category_tariff_category_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  |  | 
additional_data |  | jsonb |  |  |  | 
subscription_price |  | numeric |  |  |  | 
tarification_price |  | numeric |  |  |  | 
subscription_code_id |  | integer |  |  | [subscription_code_id](#integration.bill_code) | 
tarification_code_id |  | integer |  |  | [tarification_code_id](#integration.bill_code) | 
tarification_type |  | cms.tarification_type |  | 'DAY'::cms.tarification_type | NOT NULL | DAY, MONTH, HOUR, NEVER, WEEK
tarification_interval |  | integer |  |  |  | 
free_interval |  | integer |  | 0 |  | 
copy_code_id |  | integer |  |  | [copy_code_id](#integration.bill_code) | 
free_interval_type |  | cms.tarification_type |  | 'DAY'::cms.tarification_type | NOT NULL | DAY, MONTH, HOUR, NEVER, WEEK
unsubscribe_after_expire | Отключать по истечении оплаченного срока | boolean |  | false |  |  | 

#### cms.user

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **user_id** _(pk)_ |  | integer |  | nextval('cms.cms_user_cms_user_id_seq'::regclass) | NOT NULL | 
login |  | character varying | 100 |  | NOT NULL | 
password |  | character varying | 60 |  |  | 
created_at |  | timestamp without time zone |  | now() |  | 
title |  | character varying | 100 |  |  | 
content_provider_id |  | integer |  |  | [content_provider_id](#content.provider) | 
role_id |  | integer |  |  | [role_id](#cms.role) | 
access_token |  | character varying |  |  |  | 
access_token_expired_at |  | timestamp without time zone |  |  |  | 
refresh_token |  | character varying |  |  |  | 
is_ldap |  | boolean |  | false | NOT NULL | 
is_disabled |  | boolean |  | false | NOT NULL | 
logged_in_at |  | timestamp without time zone |  |  |  | 
email |  | character varying | 150 | NULL::character varying |  |  | 

#### cms.user_provider

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **user_id** _(pk)_ |  | integer |  |  | NOT NULL, [user_id](#cms.user) | 
**content_provider_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_provider_id](#content.provider) |  | 

#### cms.ussd_shortcode

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **ussd_shortcode_id** _(pk)_ |  | integer |  | nextval('cms.ussd_shortcode_ussd_shortcode_id_seq'::regclass) | NOT NULL | 
short_code |  | integer |  |  | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL, [showcase_id](#cms.showcase) | 
publication_id |  | integer |  |  | NOT NULL, [publication_id](#cms.publication) | 
date_start |  | timestamp without time zone |  | now() | NOT NULL | 
date_end |  | timestamp without time zone |  | now() | NOT NULL |  | 

## Схема: content

### Таблицы

#### content.advertisment

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'ADVERTISMENT'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  |  | 
params |  | jsonb |  |  |  | 
play_from |  | timestamp without time zone |  |  |  | 
play_until |  | timestamp without time zone |  |  |  | 
advertisment_group_id |  | integer |  |  | [advertisment_group_id](#content.advertisment_group) | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.advertisment_group

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **advertisment_group_id** _(pk)_ |  | integer |  | nextval('content.advertisment_group_advertisment_group_id_seq'::regclass) | NOT NULL | 
title |  | character varying |  |  |  | 
percentage |  | smallint |  | 0 | NOT NULL | 
sort_order |  | integer |  | 0 | NOT NULL | 
is_disabled |  | boolean |  | true | NOT NULL | 
created_at |  | timestamp without time zone |  |  | NOT NULL | 
updated_at |  | timestamp without time zone |  |  |  |  | 

#### content.content


Дочерние таблицы:


 - [content.advertisment](#content.advertisment)
 - [content.content_unit](#content.content_unit)
 - [content.day_in_history](#content.day_in_history)
 - [content.info_currency](#content.info_currency)
 - [content.info_weather](#content.info_weather)
 - [content.musical_box](#content.musical_box)
 - [content.package](#content.package)
 - [content.user_generated](#content.user_generated)
 - [ivr.prompt](#ivr.prompt)
 - [content.own_wave](#content.own_wave)

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid |  | uuid |  | uuid_generate_v4() | NOT NULL | 
name |  | character varying |  |  |  | 
type |  | content.type |  |  | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
file_status |  | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state |  | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone |  | boolean |  | false | NOT NULL | 
additional_data |  | jsonb |  | '{}'::jsonb |  | 
state_updated_at | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id |  | integer |  |  |  | 
is_deleted |  | boolean |  | false | NOT NULL |  | 

#### content.content_provider_dependency

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **lead_content_provider_id** _(pk)_ |  | integer |  |  | NOT NULL, [lead_content_provider_id](#content.provider) | 
**dependent_content_provider_id** _(pk)_ |  | integer |  |  | NOT NULL, [dependent_content_provider_id](#content.provider) |  | 

#### content.content_unit

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'CONTENT_UNIT'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  | [content_provider_id](#content.provider) | 
artist_id |  | integer |  |  | [artist_id](#cms.artist) | 
rights_date_end |  | timestamp without time zone |  |  |  | 
name_vector |  | tsvector |  |  |  | 
copyright_id |  | integer |  |  | [copyright_id](#content.copyright) | 
latin_name |  | character varying |  |  |  | 
cms_show |  | boolean |  | true | NOT NULL | 
genre_id |  | integer |  |  | [genre_id](#content.genre) | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.converter

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **id** _(pk)_ |  | bigint |  | nextval('content.converter_id_seq'::regclass) | NOT NULL | 
run_uniqueid |  | character varying |  |  | NOT NULL | 
source_fileinfo |  | jsonb |  |  |  | 
result_fileinfo |  | jsonb |  |  |  | 
processed_at |  | timestamp without time zone |  |  |  | 
original_fileinfo |  | jsonb |  |  |  | 
uuid |  | uuid |  |  |  | 
content_id |  | integer |  |  |  |  | 

#### content.copyright

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **copyright_id** _(pk)_ |  | integer |  | nextval('content.copyright_copyright_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  |  | 
description |  | character varying |  |  |  | 
additional_data |  | character varying |  |  |  | 
content_provider_id |  | integer |  |  | [content_provider_id](#content.provider) |  | 

#### content.day_in_history

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'DAY_IN_HISTORY'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  |  | 
day |  | smallint |  |  | NOT NULL | 
month |  | smallint |  |  | NOT NULL | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.genre

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **genre_id** _(pk)_ |  | integer |  | nextval('content.genre_genre_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  |  | 
additional_data |  | jsonb |  | '{}'::jsonb |  |  | 

#### content.image_relation

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **image_id** _(pk)_ |  | integer |  |  | NOT NULL | 
**content_id** _(pk)_ |  | integer |  |  | NOT NULL |  | 

#### content.info_currency

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'INFO_CURRENCY'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  |  | 
currency_code |  | character varying |  |  | NOT NULL, [currency_code](#platform.currency) | 
play_from |  | timestamp without time zone |  |  | NOT NULL | 
play_until |  | timestamp without time zone |  |  | NOT NULL | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.info_weather

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'INFO_WEATHER'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  |  | 
play_from |  | timestamp without time zone |  |  | NOT NULL | 
play_until |  | timestamp without time zone |  |  | NOT NULL | 
region_id |  | integer |  | 1 | NOT NULL | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.musical_box

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  |  | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  |  | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.musical_box_item

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_musical_box_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_musical_box_id](#content.musical_box) | 
**content_unit_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_unit_id](#content.content_unit) | 
sort_order |  | integer |  |  |  | 
additional_data |  | jsonb |  | '{}'::jsonb | NOT NULL |  | 

#### content.own_wave

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  |  | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  |  | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.package

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'PACKAGE'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Контент провайдер | integer |  |  | [content_provider_id](#content.provider) | 
latin_name |  | character varying |  |  |  | 
genre_id |  | integer |  |  |  | 
rights_date_end |  | timestamp without time zone |  | NULL::timestamp without time zone |  | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.package_item

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_package_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_package_id](#content.package) | 
**content_unit_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_unit_id](#content.content_unit) | 
sort_order |  | integer |  |  |  |  | 

#### content.provider

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_provider_id** _(pk)_ |  | integer |  | nextval('content.content_provider_content_provider_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  |  | 
description |  | character varying |  |  |  | 
additional_data |  | jsonb |  |  |  | 
sort_order |  | integer |  | 0 | NOT NULL | 
default_content_state |  | content.state |  | 'AWAITING'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING | 

#### content.provider_services

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_provider_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_provider_id](#content.provider) | 
**service_code** _(pk)_ |  | crm.service_code |  |  | NOT NULL, [service_code](#crm.service) | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART | 

#### content.provider_showcases

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_provider_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_provider_id](#content.provider) | 
**showcase_id** _(pk)_ |  | integer |  |  | NOT NULL, [showcase_id](#cms.showcase) |  | 

#### content.provider_tariff_categories

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_provider_id** _(pk)_ |  | integer |  |  | NOT NULL, [content_provider_id](#content.provider) | 
**tariff_category_id** _(pk)_ |  | integer |  |  | NOT NULL, [tariff_category_id](#cms.tariff_category) |  | 

#### content.scheduler

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_scheduler_id** _(pk)_ |  | integer |  | nextval('content.scheduler_content_scheduler_id_seq'::regclass) | NOT NULL | 
content_id |  | integer |  |  | NOT NULL | 
content_unit_id |  | integer |  |  | NOT NULL, [content_unit_id](#content.content_unit) | 
play_date |  | date |  |  | NOT NULL | 
additional_data |  | jsonb |  | '{}'::jsonb | NOT NULL |  | 

#### content.sms_relation

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  |  | NOT NULL | 
**sms_collection_id** _(pk)_ |  | integer |  |  | NOT NULL, [sms_collection_id](#crm.sms_collection) | 
is_deleted |  | boolean |  | false | NOT NULL |  | 

#### content.synchronization

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **synchronization_id** _(pk)_ |  | bigint |  | nextval('content.synchronization_synchronization_id_seq'::regclass) | NOT NULL | 
content_id |  | integer |  |  | NOT NULL | 
stage | Этап синхронизации | content.synchronization_stage |  | 'DOWNLOAD'::content.synchronization_stage |  | DOWNLOAD, CONVERTING, SYNCHRONIZATION, COMPLETE
status | Статус текущего этапа | content.synchronization_status |  | 'AWAITING'::content.synchronization_status |  | AWAITING, SUCCESS, RETRY, ERROR, CANCEL
retry_count | Количество попыток повтора операции | smallint |  | 0 | NOT NULL | 
source_url | URL для скачивания файла | character varying |  |  |  | 
source_hash | MD5 хэш-сумма файла - источника | character varying | 32 | NULL::character varying |  | 
event_id | ID запроса API | character varying |  |  |  | 
destinations | Список выносов для синхронизации контента со статусами и таймстемпами | jsonb |  | '{}'::jsonb | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
updated_at |  | timestamp without time zone |  | now() | NOT NULL |  | 

#### content.user_generated

```
Контент, загруженный абонентами
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'USER_GENERATED'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Контент провайдер | integer |  |  | [content_provider_id](#content.provider) | 
owner_msisdn |  | bigint |  |  | NOT NULL, [owner_msisdn](#subscriber.subscriber) | 
tariff_category_id |  | integer |  |  | [tariff_category_id](#cms.tariff_category) | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### content.uuid_history

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **uuid_history_id** _(pk)_ |  | integer |  | nextval('content.uuid_history_uuid_history_id_seq'::regclass) | NOT NULL | 
content_id |  | integer |  |  | NOT NULL | 
uuid |  | uuid |  |  |  | 
created_at |  | timestamp without time zone |  |  |  |  | 

## Схема: crm

### Таблицы

#### crm.customer_group

```
Корпоративные группы абонентов
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **customer_group_id** _(pk)_ |  | integer |  | nextval('crm.customer_group_customer_group_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  |  | 
owner_msisdn |  | bigint |  |  | [owner_msisdn](#subscriber.subscriber) | 
paid_until |  | timestamp without time zone |  |  |  |  | 

#### crm.customer_group_member

```
Списки абонентов в корпоративных группах
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **customer_group_id** _(pk)_ |  | integer |  |  | NOT NULL, [customer_group_id](#crm.customer_group) | 
**msisdn** _(pk)_ |  | bigint |  |  | NOT NULL, [msisdn](#subscriber.subscriber) | 
created_at |  | timestamp without time zone |  | now() |  |  | 

#### crm.customer_group_member_confirmation

```
Список номеров абонентов, ожидающих подтверждения на подключение корпоративного тонинга
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **customer_group_id** _(pk)_ |  | integer |  |  | NOT NULL, [customer_group_id](#crm.customer_group) | 
**msisdn** _(pk)_ |  | bigint |  |  | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL |  | 

#### crm.notification_queue

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **notification_queue_id** _(pk)_ |  | integer |  | nextval('crm.notification_queue_notification_queue_id_seq'::regclass) | NOT NULL | 
msisdn |  | bigint |  |  |  | 
message |  | character varying |  |  |  | 
short_number |  | character varying |  |  |  | 
created_at |  | timestamp without time zone |  | now() |  | 
notification_time |  | timestamp without time zone |  | now() |  | 
completed_at |  | timestamp without time zone |  |  |  | 
status |  | crm.notification_status |  | 'QUEUE'::crm.notification_status |  | QUEUE, COMPLETED, ERROR
additional_data |  | json |  |  |  |  | 

#### crm.service

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **code** _(pk)_ |  | crm.service_code |  |  | NOT NULL | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
tariff_category_id |  | integer |  |  | [tariff_category_id](#cms.tariff_category) | 
integration_code |  | character varying |  |  |  |  | 

#### crm.service_default_content

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **service_default_content_id** _(pk)_ |  | integer |  | nextval('crm.service_default_content_service_default_content_id_seq'::regclass) | NOT NULL | 
service_code |  | crm.service_code |  |  |  | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
publication_id |  | integer |  |  | NOT NULL, [publication_id](#cms.publication) | 
created_at |  | timestamp without time zone |  | now() |  | 
sort_order |  | integer |  | 0 | NOT NULL | 
showcase_id |  | integer |  |  |  |  | 

#### crm.sms_collection

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **sms_collection_id** _(pk)_ |  | integer |  | nextval('crm.sms_collection_sms_collection_id_seq'::regclass) | NOT NULL | 
comment |  | character varying |  |  |  | 
conditions |  | json |  | '[]'::json | NOT NULL | 
updated_at |  | timestamp without time zone |  | '2019-05-17 23:03:24.655967'::timestamp without time zone |  | 
created_at |  | timestamp without time zone |  | '2019-05-17 23:12:04.077163'::timestamp without time zone | NOT NULL |  | 

#### crm.sms_collection_history

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **sms_collection_history_id** _(pk)_ |  | integer |  | nextval('crm.sms_collection_history_sms_collection_history_id_seq'::regclass) | NOT NULL | 
sms_collection_id |  | integer |  |  | NOT NULL | 
updated_at |  | timestamp without time zone |  | '2019-05-20 18:28:33.603412'::timestamp without time zone | NOT NULL | 
user_id |  | integer |  |  |  |  | 

#### crm.sms_collection_message

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **sms_collection_id** _(pk)_ |  | integer |  |  | NOT NULL, [sms_collection_id](#crm.sms_collection) | 
**sms_message_id** _(pk)_ |  | integer |  |  | NOT NULL, [sms_message_id](#crm.sms_message) | 
sort_order |  | integer |  |  |  |  | 

#### crm.sms_message

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **sms_message_id** _(pk)_ |  | integer |  | nextval('crm.sms_message_sms_message_id_seq'::regclass) | NOT NULL | 
text |  | character varying |  |  | NOT NULL | 
comment |  | character varying |  |  |  | 
sms_number_id | Id исходящего короткого номера. | integer |  |  |  | 
updated_at |  | timestamp without time zone |  | '2019-05-17 23:03:24.655967'::timestamp without time zone |  | 
created_at |  | timestamp without time zone |  | '2019-05-17 23:12:04.077163'::timestamp without time zone | NOT NULL |  | 

#### crm.sms_message_history

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **sms_message_history_id** _(pk)_ |  | integer |  | nextval('crm.sms_message_history_sms_message_history_id_seq'::regclass) | NOT NULL | 
sms_message_id |  | integer |  |  | NOT NULL | 
updated_at |  | timestamp without time zone |  | '2019-05-20 18:28:33.803515'::timestamp without time zone | NOT NULL | 
user_id |  | integer |  |  |  |  | 

#### crm.sms_number

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **sms_number_id** _(pk)_ |  | integer |  | nextval('crm.sms_number_sms_number_id_seq'::regclass) | NOT NULL | 
number |  | character varying |  |  | NOT NULL |  | 

#### crm.ussd_message

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **ussd_message_id** _(pk)_ |  | integer |  | nextval('crm.ussd_message_ussd_message_id_seq'::regclass) | NOT NULL | 
key | Ключ сообщения | character varying |  |  | NOT NULL | 
text | Текст USSD сообщения | character varying |  |  | NOT NULL | 
comment | Комментарий к сообщению | character varying |  |  |  |  | 

## Схема: integration

### Таблицы

#### integration.bill_code

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **bill_code_id** _(pk)_ |  | integer |  | nextval('integration.bill_code_bill_code_id_seq'::regclass) | NOT NULL | 
code |  | character varying |  |  | NOT NULL | 
description |  | character varying |  |  |  | 
cms_price |  | numeric |  | 0 |  | 
additional_data |  | jsonb |  | '{}'::jsonb | NOT NULL |  | 

#### integration.billing_request

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **billing_request_id** _(pk)_ |  | integer |  | nextval('integration.billing_request_billing_request_id_seq'::regclass) | NOT NULL | 
msisdn |  | bigint |  |  | NOT NULL | 
service_name |  | character varying |  |  | NOT NULL | 
requested_at |  | timestamp without time zone |  | now() | NOT NULL | 
handled |  | boolean |  | false | NOT NULL |  | 

#### integration.provisioning_request

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | msisdn |  | bigint |  |  | NOT NULL | 
action |  | integration.provisioning_request_action |  |  |  | ACTIVATION, DEACTIVATION
state |  | integration.provisioning_request_state |  | 'CREATED'::integration.provisioning_request_state | NOT NULL | CREATED, SUCCESS, ERROR
type |  | bigint |  |  |  | 
external_error_code |  | character varying |  |  |  | 
external_error_description |  | character varying |  |  |  | 
service_code |  | crm.service_code |  |  |  | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
updated_at |  | timestamp without time zone |  |  |  | 
internal_error_code |  | character varying |  |  |  | 
esb_request_id |  | character varying |  |  | NOT NULL | 
provisioning_request_id |  | bigint |  | nextval('integration.provisioning_request_provisioning_request_id_seq'::regclass) | NOT NULL |  | 

#### integration.provisioning_request_error

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **code** _(pk)_ |  | character varying |  |  | NOT NULL | 
desc |  | character varying |  |  |  | 
external_code |  | character varying |  |  |  |  | 

## Схема: ivr

### Таблицы

#### ivr.case

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **case_id** _(pk)_ |  | integer |  | nextval('ivr.case_case_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  | NOT NULL | 
schema |  | character varying |  |  |  |  | 

#### ivr.case_prompt

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | case_id |  | integer |  |  | NOT NULL, [case_id](#ivr.case) | 
prompt_id |  | integer |  |  | [prompt_id](#ivr.prompt) |  | 

#### ivr.connection

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **connection_id** _(pk)_ |  | integer |  | nextval('ivr.connection_connection_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL, [showcase_id](#ivr.showcase) | 
number |  | character varying | 50 |  | NOT NULL | 
is_test |  | boolean |  | true | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
is_deleted |  | boolean |  | false | NOT NULL | 
cms_showcase_id |  | integer |  |  | [cms_showcase_id](#cms.showcase) |  | 

#### ivr.element

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **element_id** _(pk)_ |  | integer |  | nextval('ivr.element_element_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL, [showcase_id](#ivr.showcase) | 
name |  | character varying |  |  |  | 
type |  | ivr.element_type |  |  | NOT NULL | PROMPT, MENU, PLAYER, CONDITION, ACTION
parameters |  | json |  | '{}'::json | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
updated_at |  | timestamp without time zone |  | now() | NOT NULL | 
released_at |  | timestamp without time zone |  |  |  |  | 

#### ivr.element_sandbox

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **element_id** _(pk)_ |  | integer |  | nextval('ivr.element_sandbox_element_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL, [showcase_id](#ivr.showcase) | 
name |  | character varying |  |  |  | 
type |  | ivr.element_type |  |  | NOT NULL | PROMPT, MENU, PLAYER, CONDITION, ACTION
parameters |  | json |  | '{}'::json | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
updated_at |  | timestamp without time zone |  | now() | NOT NULL | 
released_at |  | timestamp without time zone |  |  |  |  | 

#### ivr.prompt

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **content_id** _(pk)_ |  | integer |  | nextval('content.content_content_id_seq'::regclass) | NOT NULL | 
uuid *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | uuid |  | uuid_generate_v4() | NOT NULL | 
name *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | character varying |  |  |  | 
type *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.type |  | 'IVR_PROMPT'::content.type | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
created_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | now() | NOT NULL | 
file_status *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.file_state |  | 'NOT_EXISTS'::content.file_state | NOT NULL | NOT_EXISTS, UPLOADED, CONVERTED, CONVERTATION_FAILED
state *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | content.state |  | 'ACTIVE'::content.state | NOT NULL | ACTIVE, INACTIVE, AWAITING, CHECK_AWAITING
has_ringbacktone *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL | 
additional_data *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | jsonb |  | '{}'::jsonb |  | 
state_updated_at *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | timestamp without time zone |  | NULL::timestamp without time zone |  | 
content_provider_id *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | integer |  |  |  | 
voice_gender |  | ivr.voice_gender |  |  |  | FEMALE, MALE
language_id |  | integer |  |  |  | 
showcase_id |  | integer |  |  | NOT NULL | 
is_deleted *наследовано от [content.content](#content.content)* | Дата и время изменения статуса модерации | boolean |  | false | NOT NULL |  | 

#### ivr.prompt_condition

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **prompt_condition_id** _(pk)_ |  | integer |  | nextval('ivr.prompt_condition_prompt_condition_id_seq'::regclass) | NOT NULL | 
prompt_id |  | integer |  |  | NOT NULL, [prompt_id](#ivr.prompt) | 
condition |  | character varying |  |  |  | 
element_id |  | integer |  |  | NOT NULL, [element_id](#ivr.element) | 
action |  | character varying |  |  |  |  | 

#### ivr.session

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **session_id** _(pk)_ |  | integer |  | nextval('ivr.session_session_id_seq'::regclass) | NOT NULL | 
call_uniqueid |  | character varying |  |  | NOT NULL | 
msisdn |  | bigint |  |  | NOT NULL | 
last_element_id |  | integer |  |  | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL | 
connection_id |  | integer |  |  | NOT NULL | 
variables |  | json |  | '{}'::json | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL |  | 

#### ivr.showcase

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **showcase_id** _(pk)_ |  | integer |  | nextval('ivr.showcase_showcase_id_seq'::regclass) | NOT NULL | 
name |  | character varying | 100 |  |  | 
description |  | character varying |  |  |  | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
changed_at |  | timestamp without time zone |  | now() | NOT NULL | 
released_at |  | timestamp without time zone |  |  |  | 
is_deleted |  | boolean |  | false | NOT NULL | 
root_element_id |  | integer |  |  | [root_element_id](#ivr.element) | 
settings |  | json |  | '{}'::json | NOT NULL | 
cms_showcase_id |  | integer |  |  | [cms_showcase_id](#cms.showcase) |  | 

## Схема: platform

### Таблицы

#### platform.currency

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | name |  | character varying |  |  |  | 
**code** _(pk)_ |  | character varying |  |  | NOT NULL |  | 

#### platform.macroregion

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **macroregion_id** _(pk)_ |  | integer |  | nextval('platform.macroregion_macroregion_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  | NOT NULL | 
code |  | character varying |  |  | NOT NULL | 
params |  | jsonb |  | '{}'::jsonb | NOT NULL |  | 

#### platform.region

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | name |  | character varying |  |  |  | 
params |  | jsonb |  |  |  | 
code |  | character varying |  |  | NOT NULL | 
**region_id** _(pk)_ |  | integer |  | nextval('platform.region_region_id_seq'::regclass) | NOT NULL | 
macroregion_id |  | integer |  |  | NOT NULL, [macroregion_id](#platform.macroregion) |  | 

#### platform.repeat_logic

```
Логика потворов запросов в ESB
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **repeat_logic_id** _(pk)_ |  | integer |  | nextval('platform.repeat_logic_repeat_logic_id_seq'::regclass) | NOT NULL | 
action |  | integration.provisioning_request_action |  |  | NOT NULL | ACTIVATION, DEACTIVATION
category | Категория ошибки (FORIS_RUNTIME_ERROR, MSISDN_NOT_FOUND_ERROR, etc...) | character varying |  |  |  | 
pattern | Шаблон, по которому определяется ошибка | character varying |  |  | NOT NULL | 
logic | Логика повторов в виде массива интервалов {'+5 minutes', '+1 hour'} | character varying[] |  |  | NOT NULL | 
receiving_behavior | Поведение при получении ошибки | platform.repeat_logic_behavior |  | 'REPEAT'::platform.repeat_logic_behavior | NOT NULL | ROLLBACK, EXECUTE, REPEAT
last_behavior | Поведение по окончании количества повторов | platform.repeat_logic_behavior |  | 'ROLLBACK'::platform.repeat_logic_behavior | NOT NULL | ROLLBACK, EXECUTE, REPEAT
created_at |  | timestamp without time zone |  | now() |  | 
updated_at |  | timestamp without time zone |  | now() |  |  | 

#### platform.service_priority

```
Приоритет проигрывания услуг
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **case_a** _(pk)_ | Кейс профиля абонента А | platform.service_priority_case |  |  | NOT NULL | MTSRADIO_PLUS, MTSRADIO, MUSICFUN, MTSRADIO_PLUS_INFOTAINMENT, MTSRADIO_INFOTAINMENT, GOODOK_FREE, GOODOK_PAID, QUICK_PURCHASE
**case_b** _(pk)_ | Кейс профиля абонента Б | platform.service_priority_case |  |  | NOT NULL | MTSRADIO_PLUS, MTSRADIO, MUSICFUN, MTSRADIO_PLUS_INFOTAINMENT, MTSRADIO_INFOTAINMENT, GOODOK_FREE, GOODOK_PAID, QUICK_PURCHASE
priority | Приоритет кейса | platform.service_priority_case |  |  | NOT NULL | MTSRADIO_PLUS, MTSRADIO, MUSICFUN, MTSRADIO_PLUS_INFOTAINMENT, MTSRADIO_INFOTAINMENT, GOODOK_FREE, GOODOK_PAID, QUICK_PURCHASE | 

#### platform.setting

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **platform_setting_id** _(pk)_ |  | integer |  | nextval('platform.setting_platform_setting_id_seq'::regclass) | NOT NULL | 
parameter |  | character varying | 255 |  | NOT NULL | 
value |  | character varying | 255 |  | NOT NULL | 
module |  | character varying | 255 |  | NOT NULL | 
type |  | platform.setting_type |  | 'STRING'::platform.setting_type | NOT NULL | INTEGER, DOUBLE, STRING, BOOLEAN, TARIFF, SHOWCASE, TARIFFS_LIST, SHOWCASES_LIST, SMS_TEMPLATE, INTERVAL_DAYS, INTERVAL_HOURS, INTERVAL_MINUTES, INTERVAL_SECONDS, ENUM, INTERVAL_MONTHS
validation_rules | Параметры валидации | jsonb |  | '[]'::jsonb |  | 
label |  | character varying |  |  |  | 
hint |  | character varying |  |  |  | 
is_visible |  | boolean |  | true |  | 
parent_platform_setting_id |  | integer |  |  | [parent_platform_setting_id](#platform.setting) | 
options |  | jsonb |  | '{}'::jsonb | NOT NULL |  | 

## Схема: public

### Таблицы

#### public.content_with_meta

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | id |  | character varying |  |  |  | 
content_provider |  | character varying |  |  |  | 
rbt_id |  | integer |  |  |  | 
title |  | character varying |  |  |  | 
artist_id |  | character varying |  |  |  | 
expiry_date |  | date |  |  |  |  | 

#### public.CP_CONTENT

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | CP_CODE |  | character varying |  |  |  | 
CN_CODE |  | character varying |  |  |  | 
FIRST_CATE |  | character varying |  |  |  | 
SECOND_CATE |  | character varying |  |  |  | 
STATUS |  | character varying |  |  |  | 
FAIL_CODE |  | character varying |  |  |  | 
TITLE |  | character varying |  |  |  | 
ARTIST |  | character varying |  |  |  | 
FEE |  | character varying |  |  |  |  | 

#### public.exp_content

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | msisdn |  | bigint |  |  |  | 
paid_until |  | timestamp without time zone |  |  |  | 
block_status_updated_at |  | timestamp without time zone |  |  |  | 
**subscriber_content_id** _(pk)_ |  | bigint |  |  | NOT NULL |  | 

#### public.fee_history

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **id** _(pk)_ |  | integer |  | nextval('fee_history_id_seq'::regclass) | NOT NULL | 
created_at |  | timestamp without time zone |  |  | NOT NULL | 
cp_code |  | character varying | 3 |  | NOT NULL | 
cn_code |  | character varying | 6 |  | NOT NULL | 
msisdn |  | bigint |  |  |  | 
mrg_id |  | integer |  |  |  | 
fee_type |  | character varying | 20 |  | NOT NULL | 
content_type |  | character varying | 20 |  | NOT NULL | 
bill_code |  | character varying |  |  | NOT NULL | 
price |  | double precision |  |  | NOT NULL | 
content_name |  | character varying |  |  | NOT NULL | 
artist_name |  | character varying |  |  |  | 
genre_id |  | integer |  |  |  | 
showcase_id |  | integer |  |  |  |  | 

#### public.mbox

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **msisdn** _(pk)_ |  | bigint |  |  | NOT NULL |  | 

#### public.migration

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **version** _(pk)_ |  | character varying | 180 |  | NOT NULL | 
apply_time |  | integer |  |  |  |  | 

#### public.monitoring

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **id** _(pk)_ |  | bigint |  |  | NOT NULL | 
ping_time |  | timestamp without time zone |  |  |  |  | 

#### public.packages

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | id |  | character varying |  |  |  | 
title |  | character varying |  |  |  | 
content_provider |  | character varying |  |  |  | 
rbt_id |  | integer |  |  |  | 
expiry_date |  | date |  |  |  | 
content_rbt_ids |  | character varying |  |  |  |  | 

#### public.pg_stat_repl

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | pid |  | integer |  |  |  | 
usesysid |  | oid |  |  |  | 
usename |  | name |  |  |  | 
application_name |  | text |  |  |  | 
client_addr |  | inet |  |  |  | 
client_hostname |  | text |  |  |  | 
client_port |  | integer |  |  |  | 
backend_start |  | timestamp with time zone |  |  |  | 
backend_xmin |  | xid |  |  |  | 
state |  | text |  |  |  | 
sent_lsn |  | pg_lsn |  |  |  | 
write_lsn |  | pg_lsn |  |  |  | 
flush_lsn |  | pg_lsn |  |  |  | 
replay_lsn |  | pg_lsn |  |  |  | 
write_lag |  | interval |  |  |  | 
flush_lag |  | interval |  |  |  | 
replay_lag |  | interval |  |  |  | 
sync_priority |  | integer |  |  |  | 
sync_state |  | text |  |  |  |  | 

#### public.pg_stat_statements

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | userid |  | oid |  |  |  | 
dbid |  | oid |  |  |  | 
queryid |  | bigint |  |  |  | 
query |  | text |  |  |  | 
calls |  | bigint |  |  |  | 
total_time |  | double precision |  |  |  | 
min_time |  | double precision |  |  |  | 
max_time |  | double precision |  |  |  | 
mean_time |  | double precision |  |  |  | 
stddev_time |  | double precision |  |  |  | 
rows |  | bigint |  |  |  | 
shared_blks_hit |  | bigint |  |  |  | 
shared_blks_read |  | bigint |  |  |  | 
shared_blks_dirtied |  | bigint |  |  |  | 
shared_blks_written |  | bigint |  |  |  | 
local_blks_hit |  | bigint |  |  |  | 
local_blks_read |  | bigint |  |  |  | 
local_blks_dirtied |  | bigint |  |  |  | 
local_blks_written |  | bigint |  |  |  | 
temp_blks_read |  | bigint |  |  |  | 
temp_blks_written |  | bigint |  |  |  | 
blk_read_time |  | double precision |  |  |  | 
blk_write_time |  | double precision |  |  |  |  | 

#### public.plrbt

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | code |  | character varying |  |  |  | 
artist |  | character varying |  |  |  | 
track |  | character varying |  |  |  | 
sbrt_id |  | character varying |  |  |  |  | 

#### public.p_variants

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | id |  | integer |  |  |  | 
code |  | character varying |  |  |  | 
package_rbt_id |  | integer |  |  |  | 
tk_id |  | character varying |  |  |  |  | 

#### public.tmp-foris-msisdn

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | id |  | bigint |  | nextval('"tmp-foris-msisdn_id_seq"'::regclass) | NOT NULL | 
msisdn |  | bigint |  |  | NOT NULL | 
service_code |  | crm.service_code |  |  | NOT NULL | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART | 

#### public.variants

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | id |  | integer |  |  |  | 
code |  | character varying |  |  |  | 
content_rbt_id |  | integer |  |  |  | 
tk_id |  | character varying |  |  |  |  | 

#### public.with_date

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | id |  | character varying |  |  |  | 
content_provider |  | character varying |  |  |  | 
rbt_id |  | integer |  |  |  | 
expiry_date |  | date |  |  |  |  | 

## Схема: smpp

### Таблицы

#### smpp.action_command

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | action_id |  | integer |  |  | NOT NULL, [action_id](#smpp.service_action) | 
command_id |  | integer |  |  | NOT NULL, [command_id](#smpp.command) | 
parameters |  | jsonb |  |  |  | 
case_sensitive |  | boolean |  | false |  | 
message |  | character varying |  |  |  |  | 

#### smpp.action_condition

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | action_id |  | integer |  |  | NOT NULL, [action_id](#smpp.service_action) | 
condition_id |  | integer |  |  | NOT NULL, [condition_id](#smpp.condition) | 
parameter |  | character varying |  |  |  |  | 

#### smpp.action_number

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | action_id |  | integer |  |  | NOT NULL, [action_id](#smpp.service_action) | 
number_id |  | integer |  |  | NOT NULL, [number_id](#smpp.number) |  | 

#### smpp.command

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **command_id** _(pk)_ |  | integer |  | nextval('smpp.command_command_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  | NOT NULL | 
command_code |  | character varying |  |  | NOT NULL | 
case_sensitive |  | boolean |  | false | NOT NULL | 
parameters |  | jsonb |  |  |  |  | 

#### smpp.condition

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **condition_id** _(pk)_ |  | integer |  | nextval('smpp.condition_condition_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  | NOT NULL | 
condition_code |  | character varying |  |  | NOT NULL | 
label |  | character varying |  |  |  | 
parameters |  | character varying[] |  |  |  |  | 

#### smpp.handler

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **handler_id** _(pk)_ |  | integer |  | nextval('smpp.handler_handler_id_seq'::regclass) | NOT NULL | 
name |  | character varying |  |  | NOT NULL | 
handler_code |  | character varying |  |  | NOT NULL | 
label |  | character varying |  |  |  | 
actions |  | character varying[] |  |  |  |  | 

#### smpp.number

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **number_id** _(pk)_ |  | integer |  | nextval('smpp.number_number_id_seq'::regclass) | NOT NULL | 
number |  | character varying |  |  | NOT NULL | 
type |  | smpp.command_type |  |  | NOT NULL | USSD, SMS | 

#### smpp.service

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | service |  | character varying |  |  | NOT NULL | 
codes |  | crm.service_code[] |  |  | NOT NULL | 
type |  | smpp.command_type |  |  | NOT NULL | USSD, SMS | 

#### smpp.service_action

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **action_id** _(pk)_ |  | integer |  | nextval('smpp.service_action_action_id_seq'::regclass) | NOT NULL | 
sort_order |  | integer |  |  | NOT NULL | 
service_code |  | crm.service_code |  |  | NOT NULL, [service_code](#crm.service) | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
handler_id |  | integer |  |  | NOT NULL, [handler_id](#smpp.handler) | 
type |  | smpp.command_type |  |  | NOT NULL | USSD, SMS | 

#### smpp.service_handler

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | handler_id |  | integer |  |  | NOT NULL, [handler_id](#smpp.handler) | 
service_code |  | crm.service_code |  |  | NOT NULL, [service_code](#crm.service) | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART | 

#### smpp.service_number

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | number_id |  | integer |  |  | NOT NULL, [number_id](#smpp.number) | 
service_code |  | crm.service_code |  |  | NOT NULL, [service_code](#crm.service) | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART | 

#### smpp.sms_showcase

```
СМС витрины
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **showcase_id** _(pk)_ |  | integer |  | nextval('smpp.sms_showcase_showcase_id_seq'::regclass) | NOT NULL | 
cms_showcase_id |  | integer |  |  | NOT NULL, [cms_showcase_id](#cms.showcase) | 
name |  | character varying |  |  | NOT NULL |  | 

#### smpp.sms_showcase_element

```
Элементы меню СМС витрины
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **element_id** _(pk)_ |  | integer |  | nextval('smpp.sms_showcase_element_element_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL, [showcase_id](#smpp.sms_showcase) | 
parameter |  | jsonb |  |  |  | 
name |  | character varying |  |  |  | 
type |  | smpp.showcase_element_type |  |  |  | CONDITION, TEXT, ACTION | 

#### smpp.sms_showcase_number

```
Короткие номера для СМС витрины
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **number_id** _(pk)_ |  | integer |  | nextval('smpp.sms_showcase_number_number_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | [showcase_id](#smpp.sms_showcase) | 
number |  | character varying |  |  | NOT NULL |  | 

#### smpp.ussd_showcase

```
USSD витрины
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **showcase_id** _(pk)_ |  | integer |  | nextval('smpp.ussd_showcase_showcase_id_seq'::regclass) | NOT NULL | 
cms_showcase_id |  | integer |  |  | NOT NULL, [cms_showcase_id](#cms.showcase) | 
name |  | character varying |  |  | NOT NULL |  | 

#### smpp.ussd_showcase_element

```
Элементы меню USSD витрины
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **element_id** _(pk)_ |  | integer |  | nextval('smpp.ussd_showcase_element_element_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | NOT NULL, [showcase_id](#smpp.ussd_showcase) | 
parameter |  | jsonb |  |  |  | 
name |  | character varying |  |  |  | 
type |  | smpp.showcase_element_type |  |  |  | CONDITION, TEXT, ACTION | 

#### smpp.ussd_showcase_number

```
Короткие номера для USSD витрины
```

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **number_id** _(pk)_ |  | integer |  | nextval('smpp.ussd_showcase_number_number_id_seq'::regclass) | NOT NULL | 
showcase_id |  | integer |  |  | [showcase_id](#smpp.ussd_showcase) | 
number |  | character varying |  |  | NOT NULL |  | 

## Схема: subscriber

### Таблицы

#### subscriber.abc_def

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **prefix_id** _(pk)_ |  | integer |  | nextval('subscriber.abc_def_prefix_id_seq'::regclass) | NOT NULL | 
abc |  | bigint |  |  | NOT NULL | 
def |  | bigint |  |  | NOT NULL |  | 

#### subscriber.blacklist

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | msisdn |  | bigint |  |  | NOT NULL | 
created_at |  | timestamp without time zone |  | now() |  | 
type |  | subscriber.blacklist_type |  |  | NOT NULL | RFT_SUBSCRIPTION_BAN, RBT_SUBSCRIPTION_BAN, RBT_STARTPKG_SUBSCRIPTION_BAN, SMSPROMO_BAN, RBT_PARTNER_BAN, HANGUP
**blacklist_id** _(pk)_ |  | integer |  | nextval('subscriber.blacklist_blacklist_id_seq'::regclass) | NOT NULL |  | 

#### subscriber.blacklist_history

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **blacklist_history_id** _(pk)_ |  | integer |  | nextval('subscriber.blacklist_history_blacklist_history_id_seq'::regclass) | NOT NULL | 
source_id |  | integer |  |  | NOT NULL, [source_id](#subscriber.blacklist_history_source) | 
msisdn |  | bigint |  |  | NOT NULL | 
blacklist_type |  | subscriber.blacklist_type |  |  |  | RFT_SUBSCRIPTION_BAN, RBT_SUBSCRIPTION_BAN, RBT_STARTPKG_SUBSCRIPTION_BAN, SMSPROMO_BAN, RBT_PARTNER_BAN, HANGUP
action |  | subscriber.blacklist_history_action_type |  |  | NOT NULL | INSERT, DELETE, NONE
user_id |  | integer |  |  | [user_id](#cms.user) | 
created_at |  | timestamp without time zone |  | '2019-04-12 12:37:42.416806'::timestamp without time zone | NOT NULL |  | 

#### subscriber.blacklist_history_source

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **source_id** _(pk)_ |  | integer |  | nextval('subscriber.blacklist_history_source_source_id_seq'::regclass) | NOT NULL | 
source |  | character varying |  |  | NOT NULL | 
source_type |  | subscriber.blacklist_history_source_type |  |  | NOT NULL | MSISDN, TXT, NONE
upload_at |  | timestamp without time zone |  | '2019-04-08 18:35:56.236973'::timestamp without time zone | NOT NULL |  | 

#### subscriber.content

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | msisdn |  | bigint |  |  | NOT NULL, [msisdn](#subscriber.subscriber) | 
content_id |  | integer |  |  |  | 
paid_from |  | timestamp without time zone |  |  |  | 
paid_until |  | timestamp without time zone |  |  |  | 
**subscriber_content_id** _(pk)_ |  | bigint |  | nextval('subscriber.subscriber_content_subscriber_content_id_seq'::regclass) | NOT NULL | 
service_code |  | crm.service_code |  |  | NOT NULL | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
type |  | content.type |  |  | NOT NULL | ADVERTISMENT, USER_GENERATED, PACKAGE, CONTENT_UNIT, PUBLICATION, MELODY, IVR_PROMPT, DAY_IN_HISTORY, INFO_CURRENCY, INFO_WEATHER, INFOTAINMENT, OWN_WAVE, MUSICAL_BOX, STREAMING, NOTIFICATION
is_default |  | boolean |  | true | NOT NULL | 
tariff_category_id |  | integer |  |  | [tariff_category_id](#cms.tariff_category) | 
created_at |  | timestamp without time zone |  | now() |  | 
subscription_showcase_id |  | integer |  |  |  | 
last_played_at |  | timestamp without time zone |  |  |  | 
publication_code |  | character varying |  |  |  | 
state |  | content.state |  |  | NOT NULL | ACTIVE, ACTIVATING, INACTIVE, DEACTIVATING, SUSPEND
state_updated_at |  | timestamp without time zone |  | now() |  | 
last_played_content_id |  | integer |  |  |  | 
playback_data |  | jsonb |  |  |  | 
tarification_data |  | jsonb |  | '{}'::jsonb | NOT NULL | 
additional_data |  | jsonb |  | '{}'::jsonb |  | 
unsubscribe_showcase_id | Витрина - источник отписки | integer |  |  |  | 
gift_id | Связь с подарком | integer |  |  | [gift_id](#subscriber.gift) |  | 

#### subscriber.favorite

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **favorite_id** _(pk)_ |  | bigint |  | nextval('subscriber.favorite_id_seq'::regclass) | NOT NULL | 
msisdn |  | bigint |  |  | NOT NULL, [msisdn](#subscriber.subscriber) | 
content_unit_id |  | integer |  |  | [content_unit_id](#content.content_unit) | 
artist_id |  | integer |  |  | [artist_id](#cms.artist) | 
created_at |  | timestamp without time zone |  | now() |  |  | 

#### subscriber.gift

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **gift_id** _(pk)_ |  | integer |  | nextval('subscriber.gift_gift_id_seq'::regclass) | NOT NULL | 
sender_msisdn | Отправитель | bigint |  |  | NOT NULL, [sender_msisdn](#subscriber.subscriber) | 
recipient_msisdn | Получатель | bigint |  |  | NOT NULL, [recipient_msisdn](#subscriber.subscriber) | 
publication_id | ID публикации подарка | integer |  |  | NOT NULL, [publication_id](#cms.publication) | 
state | Статус подарка. AWAITING - ожидает подтвержддения, ACCEPTED - принят, REJECTED - отклонен, REMOVED - удален | subscriber.gift_state |  | 'AWAITING'::subscriber.gift_state | NOT NULL | AWAITING, ACCEPTED, REJECTED, REMOVED
created_at |  | timestamp without time zone |  |  |  | 
updated_at |  | timestamp without time zone |  |  |  |  | 

#### subscriber.mgts

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **mgts_id** _(pk)_ |  | integer |  | nextval('subscriber.mgts_mgts_id_seq'::regclass) | NOT NULL | 
start |  | bigint |  |  | NOT NULL | 
end |  | bigint |  |  | NOT NULL |  | 

#### subscriber.promotion

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **promotion_id** _(pk)_ |  | bigint |  | nextval('subscriber.promotion_promotion_id_seq'::regclass) | NOT NULL | 
msisdn |  | bigint |  |  | NOT NULL | 
content_id |  | integer |  |  | NOT NULL | 
type |  | subscriber.promotion_type |  |  | NOT NULL | ADVERTISMENT, QUICK_PURCHASE
state |  | subscriber.promotion_state |  | 'ORDERED'::subscriber.promotion_state | NOT NULL | ORDERED, COMPLETE, ANSWERED
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
expired_at |  | timestamp without time zone |  |  |  | 
answered_at |  | timestamp without time zone |  |  |  | 
answer_type |  | subscriber.promotion_answer_type |  |  |  | DTMF, SMS | 

#### subscriber.rule

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **rule_id** _(pk)_ |  | integer |  | nextval('subscriber.rule_rule_id_seq'::regclass) | NOT NULL | 
subscriber_content_id |  | integer |  |  | [subscriber_content_id](#subscriber.content) | 
msisdn |  | bigint |  |  | [msisdn](#subscriber.subscriber) | 
week_days |  | json |  |  |  | 
hours |  | json |  |  |  | 
rule_group_id |  | integer |  |  | [rule_group_id](#subscriber.rule_group) | 
created_at |  | timestamp without time zone |  | now() |  |  | 

#### subscriber.rule_group

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **rule_group_id** _(pk)_ |  | integer |  | nextval('subscriber.group_group_id_seq'::regclass) | NOT NULL | 
msisdn |  | bigint |  |  | [msisdn](#subscriber.subscriber) | 
name |  | character varying |  |  |  | 
created_at |  | timestamp without time zone |  | now() | NOT NULL |  | 

#### subscriber.rule_group_member

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **rule_group_id** _(pk)_ |  | integer |  |  | NOT NULL, [rule_group_id](#subscriber.rule_group) | 
**msisdn** _(pk)_ |  | bigint |  |  | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
name |  | character varying |  |  |  |  | 

#### subscriber.service

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | msisdn |  | bigint |  |  | NOT NULL, [msisdn](#subscriber.subscriber) | 
state |  | subscriber.service_state |  |  |  | ACTIVE, ACTIVATING, INACTIVE, DEACTIVATING, SUSPEND
state_updated_at |  | timestamp without time zone |  | now() |  | 
service_code |  | crm.service_code |  |  | NOT NULL | QUICK_PURCHASE, MUSICFUN, MTSRADIO_PLUS, MTSRADIO, MTSRU_EXTERNAL_INTERNET_VIP, MTSRU_EXTERNAL_INTERNET_1MBPS, MTSRU_EXTERNAL_MTSMUSIC30, MTSRU_EXTERNAL_MTSMUSIC7, MTSRU_EXTERNAL_BITSMART_NP, MTSRU_EXTERNAL_CALL100, MTSRU_EXTERNAL_MTSTV, MTSRU_EXTERNAL_SMARTBIT, MTSRU_EXTERNAL_TRUST, MTSRU_EXTERNAL_SUPERBIT, GOODOK, GOODOK_HYPE, GOODOK_SMART
**subscriber_service_id** _(pk)_ |  | bigint |  | nextval('subscriber.service_subscriber_service_id_seq'::regclass) | NOT NULL | 
created_at |  | timestamp without time zone |  | now() | NOT NULL | 
subscription_showcase_id |  | integer |  |  |  | 
playback_data |  | jsonb |  |  |  | 
paid_from |  | timestamp without time zone |  |  |  | 
paid_until |  | timestamp without time zone |  |  |  | 
tariff_category_id |  | integer |  |  | [tariff_category_id](#cms.tariff_category) | 
tarification_data |  | jsonb |  | '{}'::jsonb | NOT NULL | 
additional_data |  | jsonb |  | '{}'::jsonb |  | 
unsubscribe_showcase_id | Витрина - источник отписки | integer |  |  |  |  | 

#### subscriber.subscriber

 | колонка | комментарий | тип | длина | по-умолчанию | ограничения | значения | 
 | --- | --- | --- | --- | --- | --- | --- | 
 | **msisdn** _(pk)_ |  | bigint |  |  | NOT NULL | 
created_at |  | timestamp without time zone |  | now() |  | 
language |  | platform.language |  |  |  | RU, EN
block_status | Блокировка. 0 - Нет, 1 - финансовая, 2 - полная | smallint |  | 0 | NOT NULL | 
block_status_updated_at |  | timestamp without time zone |  | NULL::timestamp without time zone |  | 
region_id |  | integer |  |  |  |  | 
