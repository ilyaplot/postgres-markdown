import * as Debug from 'debug'
import {writeFileSync} from 'fs'
import * as json2md from 'json2md'
import * as pgStructure from 'pg-structure'
import {Client} from 'pg'

const debug = new Debug('make-postgres-markdown')
const functionNameFromActionStatement = /execute procedure (.*)\s*\(/i

const i18n = new (require('i18n-2'))({
    locales: ['en', 'ru'],
    directory: __dirname + '/../locales',
    extension: '.json'
})

export default async function makeMarkdown(options) {


    i18n.setLocale(options.locale)
    console.time('make-postgres-markdown')
    debug('Parsing schema')

    const ignore = options.ignore
        ? new RegExp(options.ignore)
        : false

    const client = new Client(options)
    client.connect()

    debug('Triggers')
    const triggers = await client.query(`
SELECT *
from information_schema.triggers
WHERE event_object_schema = '${options.schema}'
  `)

    // get all functions referenced by a trigger
    const knownFunctions = []
    triggers.rows.forEach(trigger => {
        const match = functionNameFromActionStatement.exec(trigger.action_statement)
        if (match.length > 1) {
            knownFunctions.push(`'${match[1]}'`)
        }
    })

    debug('Building JSON from manual queries...')
    debug('Functions')
    let sql = `
SELECT
  pg_proc.*,
  pg_language.lanname as language,
  pg_type.typname as return_type
FROM pg_catalog.pg_proc
JOIN pg_language ON pg_language.oid = pg_proc.prolang
JOIN pg_type ON pg_type.oid = pg_proc.prorettype
WHERE proowner != 10 
  `
    if (knownFunctions.length) {
        sql += `OR proname IN (${knownFunctions.join(',')})`
    }
    const functions = await client.query(sql).catch(e => console.error(e))

    debug('Extensions')
    const extensions = await client.query(`
SELECT *
FROM pg_available_extensions
WHERE installed_version IS NOT null;
  `).catch(e => console.error(e))

    const roles = await client.query(`
    WITH membership AS (
      SELECT
        pg_auth_members.roleid AS role_id,
        array_agg(pg_authid.rolname) AS roles
      FROM pg_auth_members
      JOIN pg_authid ON pg_authid.oid = pg_auth_members.member
      GROUP BY role_id
    )
    SELECT
      pg_authid.*,
      setconfig,
      membership.roles
    FROM pg_authid
    LEFT OUTER JOIN pg_db_role_setting ON pg_db_role_setting.setrole = pg_authid.oid
    LEFT OUTER JOIN membership ON membership.role_id = pg_authid.oid;
  `).catch(e => console.error(e))

    client.end()

    const db = await pgStructure(options, [options.schema])
    debug('Building JSON representation from pg-structure...')
    const schema = db.schemas.get('public')
    const tables = schema.tables

    const markdown = [
        {h1: i18n.__('Tables')},
        ...renderTables(tables, 'table', ignore),
        {h1: i18n.__('Views')},
        ...renderTables(tables, 'view', ignore),
        {h1: i18n.__('Roles')},
        {table: renderRoles(roles)}
    ]

    if (functions.rows.length) {
        markdown.push({
            h1: i18n.__('Functions')
        })

        functions.rows.forEach(func => {
            markdown.push({
                h2: func.proname
            })
            markdown.push({
                table: {
                    headers: [i18n.__('return type'), i18n.__('volatility')],
                    rows: [
                        [func.return_type, func.provolatile]
                    ]
                }
            })
            markdown.push({
                code: {
                    // markdown doesn't know how to format languages like pgpsql
                    language: ~func.language.indexOf('sql')
                        ? 'sql'
                        : func.language,
                    content: func.prosrc
                }
            })
        })
    }

    if (extensions.rows) {
        markdown.push({
            h1: i18n.__('Extensions')
        })

        markdown.push({
            table: {
                headers: [
                    'name',
                    'version',
                    'description'
                ],
                rows: extensions.rows.map(extension => ({
                    name: extension.name,
                    version: extension.installed_version,
                    description: extension.comment
                }))
            }
        })
    }

    debug('Converting JSON to markdown')
    const output = json2md(markdown)

    debug('Writing output')
    writeFileSync(options.output, `---
title: ${i18n.__('Database Documentation')}

search: true
---

${output}
  `)

    debug('Finished')
    console.timeEnd('make-postgres-markdown')

    function renderConstraints(column) {
        const constraints = []

        if (!column.allowNull) {
            constraints.push('NOT NULL')
        }

        for (let [constraintName, constraint] of column.foreignKeyConstraints) {
            for (let [name, column] of constraint.columns) {
                constraints.push(`[${name}](#${constraint.referencedTable.name})`)
            }
        }

        return constraints.length && constraints.join(', ')
    }

    function escapeDescription(description) {
        if (!description) {
            return ''
        }

        let result =  description.replace(/\r?\n/g, ' ').replace(/\s+/, ' ')
        console.log('resuls: ', result)
        return result;
    }

    function renderTables(tables, kind, ignore) {
        const markdown = []

        debug(`rendering tables (${kind})`)
        for (let [name, table] of tables) {
            if (
                table.kind !== kind
                || (ignore && ignore.exec(name))
            ) {
                continue
            }

            markdown.push({h2: name})
            if (table.description) {
                markdown.push({
                    code: {
                        content: table.description
                    }
                })
            }

            const markdownTable = {
                headers: [
                    'column',
                    'comment',
                    'type',
                    'length',
                    'default',
                    'constraints',
                    'values'
                ],
                rows: []
            }

            for (let [name, column] of table.columns) {

                if (column.isPrimaryKey) {
                    name = '**' + name + '** _(pk)_'
                }

                markdownTable.rows.push([
                    name || '',
                    escapeDescription(column.comment),
                    column.type || '',
                    column.length || '',
                    column.default || '',
                    renderConstraints(column) || '',
                    column.enumValues ? column.enumValues.join(', ') : ''
                ])
            }

            markdown.push({table: markdownTable})

            const tableTriggers = triggers.rows
                .filter(
                    trigger => trigger.event_object_table === name
                )
                .map(trigger => ({
                    name: trigger.trigger_name,
                    timing: trigger.action_timing,
                    orientation: trigger.action_orientation,
                    manipulation: trigger.event_manipulation,
                    statement: actionStatementToFunctionLink(trigger.action_statement)
                }))

            if (tableTriggers.length) {
                markdown.push({h3: i18n.__('Triggers')})
                markdown.push({
                    table: {
                        headers: [
                            'name',
                            'timing',
                            'orientation',
                            'manipulation',
                            'statement'
                        ],
                        rows: tableTriggers
                    }
                })
            }
        }

        return markdown
    }

    function renderRoles(roles) {
        return {
            headers: [
                'name',
                'super user',
                'inherits',
                'create role',
                'create database',
                'can login',
                'bypass RLS',
                'connection limit',
                'configuration',
                'roles granted'
            ],
            rows: roles.rows.map(role => ([
                role.rolname,
                role.rolsuper.toString(),
                role.rolinherit.toString(),
                role.rolcreaterole.toString(),
                role.rolcreatedb.toString(),
                role.rolcanlogin.toString(),
                role.rolbypassrls.toString(),
                role.rolconnlimit,
                role.setconfig || '',
                role.roles || ''
            ]))
        }
    }
}

function actionStatementToFunctionLink(actionStatement) {
    const functionName = functionNameFromActionStatement.exec(actionStatement)
    if (functionName.length > 1) {
        return actionStatement.replace(
            functionName[1],
            `<a href="#${functionName[1]}">${functionName[1]}</a>`
        )
    }

    return actionStatement
}
