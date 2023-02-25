'use strict'

import * as Debug from 'debug'
import {Schema as PgSchema, Table as PgTable, EnumType} from 'pg-structure'
import Inherits from "./Inherits";

const debug = new Debug('postgres-markdown')

export default class MdSchema {
    private readonly pgSchema: PgSchema
    private readonly inheritsColumns: Array<Inherits>
    private readonly i18n: any

    public constructor(pgSchema: PgSchema, inheritsColumns: Array<Inherits>, i18n) {
        this.pgSchema = pgSchema
        this.inheritsColumns = inheritsColumns
        this.i18n = i18n
    }

    public getMarkdownArray(): Array<any> {
        let md = [
            {h2: this.i18n.__('Schema') + ': ' + this.pgSchema.name},
            {h3: this.i18n.__('Tables')}
        ]

        this.pgSchema.tables.forEach((table) => {
            md = md.concat(this.genTable(table))
        })

        return md;
    }

    public genTable(pgTable: PgTable): Array<any> {
        let md = [];
        md.push({h4: pgTable.fullName})

        if (pgTable.comment) {
            md.push({
                code: {
                    content: pgTable.comment
                }
            })
        }

        let inheritedTables: Array<Inherits> = this.inheritsColumns.filter((inherits: Inherits) => inherits.findParentTableKey === pgTable.fullName)
        if (inheritedTables.length > 0) {
            md.push({
                p: `${this.i18n.__('Inherited tables')}:`
            })
            md.push({
                ul: inheritedTables
                    .map((inherits: Inherits) => `[${inherits.findTableKey}](#${inherits.findTableKey.replace('.', '')})`)
                    .filter((value, index, self) => self.indexOf(value) === index)
            })
        }

        const headers = ([
            'column',
            'comment',
            'type',
            'length',
            'default',
            'constraints',
            'values'
        ]).map(h => this.i18n.__(h));

        const markdownTable = {
            outer_bars: false,
            headers,
            rows: []
        }

        pgTable.columns.forEach((column) => {
            let name = column.name
            const originalName = name

            if (column.isPrimaryKey) {
                name = '**' + name + '** _(pk)_'
            }

            let inherits: Inherits;

            let inheritsIndex = this.inheritsColumns.findIndex((item: Inherits) => item.findColumnKey == [pgTable.fullName, name].join('.').replace('.', ''))
            if (inheritsIndex !== -1) {
                inherits = this.inheritsColumns[inheritsIndex]
                name += ` *${this.i18n.__('inherits from')} [${inherits.findParentTableKey}](#${inherits.findParentTableKey.replace('.', '')})*`
            }

            let columnComment = column.comment || ''

            if (!columnComment.length && inherits && inherits.column_parent_name == originalName) {
                columnComment = inherits.column_parent_description || ''
            }

            let columnType = column.type.name || ''

            if (column.type instanceof EnumType) {
                columnType = column.type.schema.name + '.' + columnType
            }

            if (column.arrayDimension || 0 > 0) {
                columnType += '[]'
            }

            markdownTable.rows.push([
                name || '',
                this.escapeInlineDescription(columnComment),
                columnType || '',
                column.length || '',
                column.defaultWithTypeCast || '',
                this.renderConstraints(column) || '',
                column.type instanceof EnumType ? column.type.values.join(', ') : ''
            ])
        })

        md.push({table: markdownTable})

        return md
    }

    private escapeInlineDescription(description: String): String {
        if (!description) {
            return ''
        }
        return description.replace(/\r?\n/g, ' ').replace(/\s+/, ' ')
    }

    private renderConstraints(column) {
        const constraints = []

        if (!column.allowNull) {
            constraints.push('NOT NULL')
        }

        column.parent.constraints.forEach((constraint) => {
            constraints.push(`[${constraint.name}](#${constraint.table.schema.name}${constraint.table.name})`)
        });

        return constraints.length && constraints.join(', ')
    }
}
