import * as Debug from 'debug'
import {writeFileSync} from 'fs'
import * as json2md from 'json2md'
import * as pgStructure from 'pg-structure'
import {Client} from 'pg'
import MdSchema from "./md-schema";

const debug = new Debug('make-postgres-markdown')

const i18n = new (require('i18n-2'))({
    locales: ['en', 'ru'],
    directory: __dirname + '/../locales',
    extension: '.json'
})

export default async function makeMarkdown(options) {
    i18n.setLocale(options.locale)
    console.time('make-postgres-markdown')
    debug('Parsing schema')

    const db = await pgStructure(options, [options.schema])
        .catch(err => console.error(err))

    const client = new Client(options)
    client.connect()

    let sql = `select s.nspname as name
               from pg_catalog.pg_namespace s
               where nspname not in ('information_schema', 'pg_catalog')
                 and nspname not like 'pg_toast%'
                 and nspname not like 'pg_temp_%'
               order by name`

    const schemas = await client.query(sql)
        .catch(err => console.error(err))

    const serverVersion = await client.query(`SELECT version()`)
        .catch(err => console.error(err))


    /**
     * @todo
     */

    client.end()

    debug('Building JSON representation from pg-structure...')
console.log(serverVersion.rows[0].version)
    let markdownArray = [
        `---`,
        {h1: i18n.__('Database Documentation')},
        `---`,
        `${i18n.__('Created at')}: ` + (new Date()).toISOString(),
        `${i18n.__('Server version')}: ${serverVersion.rows[0].version}`,
    ]

    for (let schema of schemas.rows) {
        const pgSchema = db.schemas.get(schema.name)
        const mgSchema = new MdSchema(pgSchema, i18n)
        markdownArray = markdownArray.concat(mgSchema.getMarkdownArray())
    }
    console.log('markdownArray', markdownArray)
    const output = json2md(markdownArray)

    debug('Writing output')
    writeFileSync(options.output, output)

    debug('Finished')
    console.timeEnd('make-postgres-markdown')
}
