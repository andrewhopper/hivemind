"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Fact = {
    id: string
    title: string
    description: string
    source: string
    createdAt: Date
}

export const columns: ColumnDef<Fact>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "source",
        header: "Source",
    },
] 