import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NewFactForm } from "@/components/facts/new-fact-form"

export default function NewFactPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Add New Fact</h1>
                <Button variant="outline" asChild>
                    <Link href="/">Back to Facts</Link>
                </Button>
            </div>
            <NewFactForm />
        </div>
    )
}
