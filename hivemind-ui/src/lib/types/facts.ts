import { z } from "zod"

export enum FactCategory {
    FRONTEND = "FRONTEND",
    BACKEND = "BACKEND",
    DATABASE = "DATABASE",
    FULL_STACK = "FULL_STACK",
    DESIGN_PATTERN = "DESIGN_PATTERN",
    ARCHITECTURE_PATTERN = "ARCHITECTURE_PATTERN",
    TESTING_PATTERN = "TESTING_PATTERN",
    NAMING_CONVENTION = "NAMING_CONVENTION",
    PROJECT_STRUCTURE = "PROJECT_STRUCTURE",
    CODE_STYLE = "CODE_STYLE",
    DEPLOYMENT = "DEPLOYMENT",
    CI_CD = "CI_CD",
    MONITORING = "MONITORING",
    SECURITY = "SECURITY",
    GIT_WORKFLOW = "GIT_WORKFLOW",
    CODE_REVIEW = "CODE_REVIEW",
    DOCUMENTATION = "DOCUMENTATION",
    PACKAGE_MANAGEMENT = "PACKAGE_MANAGEMENT",
    VERSIONING = "VERSIONING",
    OPTIMIZATION = "OPTIMIZATION",
    CACHING = "CACHING",
    ACCESSIBILITY = "ACCESSIBILITY",
    INTERNATIONALIZATION = "INTERNATIONALIZATION",
    ERROR_HANDLING = "ERROR_HANDLING"
}

export enum StrictnessLevel {
    REQUIRED = "REQUIRED",
    RECOMMENDED = "RECOMMENDED",
    OPTIONAL = "OPTIONAL"
}

export interface Condition {
    factId: string
    type: "REQUIRES" | "CONFLICTS_WITH"
}

export interface AcceptanceCriterion {
    id: string
    description: string
    validationType: "MANUAL" | "AUTOMATED"
    validationScript?: string
}

export interface Fact {
    id: string
    content: string
    strictness: StrictnessLevel
    type: string
    category: FactCategory
    minVersion: string
    maxVersion: string
    conditions: Condition[]
    acceptanceCriteria: AcceptanceCriterion[]
    createdAt: string
    updatedAt: string
    applicable: boolean
}

export const factSchema = z.object({
    id: z.string().min(1, "ID is required"),
    content: z.string().min(1, "Content is required"),
    strictness: z.nativeEnum(StrictnessLevel),
    type: z.string().min(1, "Type is required"),
    category: z.nativeEnum(FactCategory),
    minVersion: z.string().min(1, "Minimum version is required"),
    maxVersion: z.string().min(1, "Maximum version is required"),
    conditions: z.array(z.object({
        factId: z.string().min(1, "Fact ID is required"),
        type: z.enum(["REQUIRES", "CONFLICTS_WITH"])
    })),
    acceptanceCriteria: z.array(z.object({
        id: z.string().min(1, "Criterion ID is required"),
        description: z.string().min(1, "Description is required"),
        validationType: z.enum(["MANUAL", "AUTOMATED"]),
        validationScript: z.string().optional()
    }))
})

export type FactFormData = z.infer<typeof factSchema>
