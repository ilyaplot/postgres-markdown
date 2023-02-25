import * as Debug from 'debug'
import * as json2md from 'json2md'
import {Client} from 'pg'
import MdSchema from "./md-schema";
import Inherits from "./Inherits";

const fs = require("fs")

const debug = new Debug('postgres-markdown')

const i18n = new (require('i18n-2'))({
    locales: ['en', 'ru'],
    directory: __dirname + '/../../locales',
    extension: '.json'
})

export default async function makeMarkdown(options) {
    debug.enabled = options.verbose
    debug('Verbose mode enabled');
    console.time('postgres-markdown')

    i18n.setLocale(options.locale)

    const dbOptions = {
        host: options.host,
        port: options.port,
        user: options.user,
        password: options.password,
        database: options.database,
    }

    debug('Connecting to database with options: %O', dbOptions)

    const client = new Client(dbOptions)
    client.connect().catch((err) => console.error(err))

    let sql = `select s.nspname as name
               from pg_catalog.pg_namespace s
               where nspname not in ('information_schema', 'pg_catalog')
                 and nspname not like 'pg_toast%'
                 and nspname not like 'pg_temp_%'
               order by name`

    const schemas = await client.query(sql).catch(err => console.error(err))

    debug('Schemas: %O', schemas.rows);

    const serverVersion = await client.query(`SELECT version()`).catch(err => console.error(err))

    debug('Server version: %O', serverVersion.rows[0].version);

    sql = `SELECT nmsp_parent.nspname   AS parent_schema,
                  parent.relname        AS parent_table,
                  nmsp_child.nspname    AS child_schema,
                  child.relname         AS child_table,
                  column_parent.attname AS column_parent_name,
                  pgd.description       AS column_parent_description
           FROM pg_inherits
                    JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
                    JOIN pg_class child ON pg_inherits.inhrelid = child.oid
                    JOIN pg_namespace nmsp_parent ON nmsp_parent.oid = parent.relnamespace
                    JOIN pg_namespace nmsp_child ON nmsp_child.oid = child.relnamespace
                    JOIN pg_attribute column_parent ON column_parent.attrelid = parent.oid
                    JOIN pg_catalog.pg_description pgd on (pgd.objoid = parent.oid)
           WHERE column_parent.attnum > 0
             AND column_parent.attname NOT ILIKE '%pg.dropped%';`;

    const inherits = await client.query(sql)
        .catch(err => console.error(err))

    debug('Inherits: %O', inherits.rows);

    const inheritsColumns = inherits.rows.map((row) => new Inherits(row))

    client.end()

    const pgStructure = require('pg-structure');

    const db = await pgStructure(dbOptions, {includeSchemas: schemas.rows.map((schema) => schema.name)})
        .catch(err => console.error(err))

    debug('Building JSON representation from pg-structure...')

    let markdownArray = [
        {h1: i18n.__('Database Documentation')},
        `${i18n.__('Created at')}: ` + (new Date()).toISOString(),
        `${i18n.__('Server version')}: ${serverVersion.rows[0].version}`,
    ]

    for (let schema of schemas.rows) {
        let pgSchema = db.schemas.get(schema.name)
        let mdSchema = new MdSchema(pgSchema, inheritsColumns, i18n)
        markdownArray = markdownArray.concat(mdSchema.getMarkdownArray())
    }

    debug('JSON representation: %O', markdownArray)

    const output = json2md(markdownArray)

    debug('Writing output')

    fs.writeFileSync(options.output, output)


    debug('Finished')
    console.timeEnd('postgres-markdown')
}
