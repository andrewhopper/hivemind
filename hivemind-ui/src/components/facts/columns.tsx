"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Fact, StrictnessLevel } from "@/lib/types/facts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const columns: ColumnDef<Fact>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "content",
        header: "Content",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "strictness",
        header: "Strictness",
        cell: ({ row }) => {
            const strictness = row.getValue("strictness") as StrictnessLevel
            return (
                <Badge variant={
                    strictness === StrictnessLevel.REQUIRED ? "destructive" :
                        strictness === StrictnessLevel.RECOMMENDED ? "default" :
                            "secondary"
                }>
                    {strictness}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const fact = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link href={`/facts/${fact.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/facts/edit/${fact.id}`}>Edit</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
