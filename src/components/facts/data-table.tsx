"use client"

import {
    ColumnDef,
    // ... existing imports ...
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    // ... rest of interface
}

// ... rest of component code ... 