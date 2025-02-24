import { DataTable } from "@/components/facts/data-table"
import { columns } from "@/components/facts/columns"
import { getAllFacts } from "@/lib/api/facts"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
    const facts = await getAllFacts()

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto py-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Facts Library</h1>
                    <Button asChild>
                        <Link href="/facts/new">Add New Fact</Link>
                    </Button>
                </div>
                <DataTable columns={columns} data={facts} />
            </div>
        </main>
    )
}
