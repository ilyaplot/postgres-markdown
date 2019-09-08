'use strict'

export default class Inherits {
    private readonly _parent_schema: string
    private readonly _parent_table: string
    private readonly _child_schema: string
    private readonly _child_table: string
    private readonly _column_parent_name: string
    private readonly _column_parent_description: string

    public constructor({parent_schema, parent_table, child_schema, child_table, column_parent_name, column_parent_description}) {
        this._parent_schema = parent_schema
        this._parent_table = parent_table
        this._child_schema = child_schema
        this._child_table = child_table
        this._column_parent_name = column_parent_name
        this._column_parent_description = column_parent_description
    }

    get findColumnKey(): string {
        return this.findTableKey + '.' + this._column_parent_name
    }

    get findParentTableKey(): string {
        return [this._parent_schema, this._parent_table].join('.')
    }

    get findTableKey(): string {
        return [this._child_schema, this._child_table].join('.')
    }

    get parent_schema(): string {
        return this._parent_schema
    }

    get child_schema(): string {
        return this._child_schema
    }

    get child_table(): string {
        return this._child_table
    }

    get column_parent_name(): string {
        return this._column_parent_name
    }

    get parent_table(): string {
        return this._parent_table;
    }

    get column_parent_description(): string {
        return this._column_parent_description;
    }
}

