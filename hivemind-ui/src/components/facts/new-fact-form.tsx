import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FactCategory, StrictnessLevel, factSchema, type FactFormData } from "@/lib/types/facts"
import { createFact } from "@/lib/api/facts"

export function NewFactForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FactFormData>({
        resolver: zodResolver(factSchema),
        defaultValues: {
            conditions: [],
            acceptanceCriteria: []
        }
    })

    async function onSubmit(data: FactFormData) {
        try {
            setIsSubmitting(true)
            await createFact(data)
            toast.success("Fact created successfully")
            router.push("/")
        } catch (error) {
            toast.error("Failed to create fact")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">ID</label>
                    <Input
                        {...form.register("id")}
                        placeholder="Enter fact ID"
                        className="w-full"
                    />
                    {form.formState.errors.id && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.id.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <Textarea
                        {...form.register("content")}
                        placeholder="Enter fact content"
                        className="w-full min-h-[100px]"
                    />
                    {form.formState.errors.content && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Input
                        {...form.register("type")}
                        placeholder="Enter fact type"
                        className="w-full"
                    />
                    {form.formState.errors.type && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.type.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                        onValueChange={(value) => form.setValue("category", value as FactCategory)}
                        defaultValue={form.getValues("category")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(FactCategory).map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category.replace(/_/g, " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Strictness Level</label>
                    <Select
                        onValueChange={(value) => form.setValue("strictness", value as StrictnessLevel)}
                        defaultValue={form.getValues("strictness")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select strictness level" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(StrictnessLevel).map((level) => (
                                <SelectItem key={level} value={level}>
                                    {level}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.strictness && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.strictness.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Minimum Version</label>
                    <Input
                        {...form.register("minVersion")}
                        placeholder="e.g. 1.0.0"
                        className="w-full"
                    />
                    {form.formState.errors.minVersion && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.minVersion.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Maximum Version</label>
                    <Input
                        {...form.register("maxVersion")}
                        placeholder="e.g. 2.0.0 or *"
                        className="w-full"
                    />
                    {form.formState.errors.maxVersion && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.maxVersion.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Fact"}
                </Button>
            </div>
        </form>
    )
}
