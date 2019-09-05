'use strict'

import {Schema as PgSchema, Table as PgTable} from 'pg-structure'
import {Client} from 'pg'

const i18n = new (require('i18n-2'))({
    locales: ['en', 'ru'],
    directory: __dirname + '/../locales',
    extension: '.json'
})

export default class MdSchema {
    private pgSchema: PgSchema
    private client: Client
    private i18n: any

    public constructor(pgSchema: PgSchema, i18n) {
        this.pgSchema = pgSchema
        this.client = new Client()
        this.i18n = i18n
    }

    public getMarkdownArray(): Array<any> {
        let md = [
            {h2: this.i18n.__('Schema') + ': ' + this.pgSchema.name},
            {h3: this.i18n.__('Tables')}
        ]

        for (let [name, table] of this.pgSchema.tables) {
            md = md.concat(this.genTable(table))
        }

        return md;
    }

    public genTable(pgTable: PgTable): Array<any> {
        let md = [];
        md.push({h4: pgTable.fullName})

        if (pgTable.description) {
            md.push({
                code: {
                    content: pgTable.description
                }
            })
        }

        const headers = ([
            'column',
            'comment',
            'type',
            'length',
            'default',
            //'constraints',
            'values'
        ]).map(h => this.i18n.__(h));

        const markdownTable = {
            headers,
            rows: []
        }

        for (let [name, column] of pgTable.columns) {

            if (column.isPrimaryKey) {
                name = '**' + name + '** _(pk)_'
            }

            markdownTable.rows.push([
                name || '',
                this.escapeInlineDescription(column.comment),
                column.type || '',
                column.length || '',
                column.default || '',
                //renderConstraints(column) || '',
                column.enumValues ? column.enumValues.join(', ') : ''
            ])
        }

        md.push({table: markdownTable})

        return md
    }

    private escapeInlineDescription(description: String): String {
        if (!description) {
            return ''
        }
        return description.replace(/\r?\n/g, ' ').replace(/\s+/, ' ')
    }
}
