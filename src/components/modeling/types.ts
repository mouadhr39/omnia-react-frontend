


export interface Attribute {
    id: string
    name: string
    type: 'String' | "Int" | "Bool" | "Char" | "Float" | "Double" | "Date"
}

export interface TableData {
  id: string
  title: string
  attributes: Array<Attribute>
  methods: Array<string>
  x: number
  y: number
}

export interface TableRelation {
  id: string
  fromTableId: string
  toTableId: string
  cardinality: "1:1" | "1:N" | "N:N"
}

export interface PendingRelation {
  fromTableId: string
  toTableId: string
}

export interface TableProps {
  id: string
  title: string
  attributes: Array<Attribute>
  methods: Array<string>
}