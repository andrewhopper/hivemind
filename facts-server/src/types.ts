export enum FactCategory {
    // Architecture Layers
    FRONTEND = 'FRONTEND',
    BACKEND = 'BACKEND',
    DATABASE = 'DATABASE',
    FULL_STACK = 'FULL_STACK',

    // Development Patterns
    DESIGN_PATTERN = 'DESIGN_PATTERN',
    ARCHITECTURE_PATTERN = 'ARCHITECTURE_PATTERN',
    TESTING_PATTERN = 'TESTING_PATTERN',

    // Code Organization
    NAMING_CONVENTION = 'NAMING_CONVENTION',
    PROJECT_STRUCTURE = 'PROJECT_STRUCTURE',
    CODE_STYLE = 'CODE_STYLE',

    // Operations
    DEPLOYMENT = 'DEPLOYMENT',
    CI_CD = 'CI_CD',
    MONITORING = 'MONITORING',
    SECURITY = 'SECURITY',

    // Development Process
    GIT_WORKFLOW = 'GIT_WORKFLOW',
    CODE_REVIEW = 'CODE_REVIEW',
    DOCUMENTATION = 'DOCUMENTATION',

    // Dependencies
    PACKAGE_MANAGEMENT = 'PACKAGE_MANAGEMENT',
    VERSIONING = 'VERSIONING',

    // Performance
    OPTIMIZATION = 'OPTIMIZATION',
    CACHING = 'CACHING',

    // Cross-cutting
    ACCESSIBILITY = 'ACCESSIBILITY',
    INTERNATIONALIZATION = 'INTERNATIONALIZATION',
    ERROR_HANDLING = 'ERROR_HANDLING'
}

export enum StrictnessLevel {
    REQUIRED = 'REQUIRED',
    RECOMMENDED = 'RECOMMENDED',
    OPTIONAL = 'OPTIONAL'
}

export interface Condition {
    factId: string;
    type: 'REQUIRES' | 'CONFLICTS_WITH';
}

export interface AcceptanceCriterion {
    id: string;
    description: string;
    validationType: 'MANUAL' | 'AUTOMATED';
    validationScript?: string;
}

export interface FactData {
    content: string;
    strictness: StrictnessLevel;
    type: string;
    category: FactCategory;
    minVersion: string;
    maxVersion: string;
    conditions: Condition[];
    acceptanceCriteria: AcceptanceCriterion[];
    createdAt: string;
    updatedAt: string;
}

export interface StorageSearchResult extends FactData {
    id: string;
    applicable: boolean;
}

export interface ValidationResult {
    criterionId: string;
    passed: boolean;
    message?: string;
}

export interface StorageProvider {
    setFact(
        id: string,
        content: string,
        strictness: StrictnessLevel,
        type: string,
        category: FactCategory,
        minVersion: string,
        maxVersion: string,
        conditions: Condition[],
        acceptanceCriteria: AcceptanceCriterion[],
        contentEmbedding?: string
    ): Promise<void>;

    getFact(id: string): Promise<StorageSearchResult | null>;

    searchFacts(options: {
        type?: string;
        strictness?: StrictnessLevel;
        version?: string;
        embedding?: string;
        similarityThreshold?: number;
    }): Promise<StorageSearchResult[]>;

    deleteFact(id: string): Promise<boolean>;
}
