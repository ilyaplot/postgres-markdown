'use strict'

import {Schema as PgSchema, Table as PgTable} from 'pg-structure'
import Inherits from "./Inherits";

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

        let inheritedTables: Array<Inherits> = this.inheritsColumns.filter((inherits: Inherits) => inherits.findParentTableKey === pgTable.fullName)
        if (inheritedTables.length > 0) {
            md.push({
                p: `${this.i18n.__('Inherited tables')}:`
            })
            md.push({
                ul: inheritedTables
                    .map((inherits: Inherits) => `[${inherits.findTableKey}](#${inherits.findTableKey})`)
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
            headers,
            rows: []
        }

        for (let [name, column] of pgTable.columns) {

            if (column.isPrimaryKey) {
                name = '**' + name + '** _(pk)_'
            }

            let inherits: Inherits;

            let inheritsIndex = this.inheritsColumns.findIndex((item: Inherits) => item.findColumnKey == [pgTable.fullName, name].join('.'))
            if (inheritsIndex !== -1) {
                inherits = this.inheritsColumns[inheritsIndex]
                name += ` *${this.i18n.__('inherits from')} [${inherits.findParentTableKey}](#${inherits.findParentTableKey})*`
            }

            let columnComment = column.comment || ''

            if (!columnComment.length && inherits) {
                columnComment = inherits.column_parent_description || ''
            }

            let columnType = column.type || ''

            if (columnType === 'array') {
                columnType = column.arrayType + `[]`
                //console.log('column.arrayDimension', column.type, column.arrayType)
            }

            markdownTable.rows.push([
                name || '',
                this.escapeInlineDescription(columnComment),
                columnType || '',
                column.length || '',
                column.defaultWithTypeCast  || '',
                this.renderConstraints(column) || '',
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

    private renderConstraints(column) {
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
}
