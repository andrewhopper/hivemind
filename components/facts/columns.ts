"use client"

import { ColumnDef } from "@/components/ui/table"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    }
] 