import { PrismaClient } from '@prisma/client';
import * as semver from 'semver';
const prisma = new PrismaClient();
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
export async function validateCriteria(content, criteria) {
    const results = [];
    for (const criterion of criteria) {
        if (criterion.validationType === 'MANUAL') {
            results.push({
                criterionId: criterion.id,
                passed: false,
                message: 'Manual validation required'
            });
            continue;
        }
        if (!criterion.validationScript) {
            throw new ValidationError(`Automated criterion ${criterion.id} has no validation script`);
        }
        try {
            // Create a function from the validation script
            const validationFn = new Function('content', criterion.validationScript + '\nreturn ' + criterion.validationScript.match(/function\s+(\w+)/)?.[1] + '(content);');
            const passed = await Promise.resolve(validationFn(content));
            results.push({
                criterionId: criterion.id,
                passed,
                message: passed ? 'Validation passed' : 'Validation failed'
            });
        }
        catch (error) {
            results.push({
                criterionId: criterion.id,
                passed: false,
                message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    }
    return results;
}
export async function validateFact(fact, version) {
    const errors = [];
    // Validate required fields
    if (!fact.content)
        errors.push('Missing required field: content');
    if (!fact.category)
        errors.push('Missing required field: category');
    if (!fact.type)
        errors.push('Missing required field: type');
    if (!fact.strictness)
        errors.push('Missing required field: strictness');
    // Validate version compatibility if version is provided
    if (version && fact.minVersion && fact.maxVersion) {
        const isCompatible = semver.satisfies(version, `>=${fact.minVersion} ${fact.maxVersion === '*' ? '' : '<' + fact.maxVersion}`);
        if (!isCompatible) {
            errors.push(`Version ${version} is not compatible (requires >=${fact.minVersion} <${fact.maxVersion})`);
        }
    }
    // Validate conditions
    const conditionValidation = await validateConditions(fact.id);
    if (!conditionValidation.isValid) {
        errors.push(...conditionValidation.errors);
    }
    // Validate acceptance criteria
    if (fact.acceptanceCriteria?.length) {
        const criteriaResults = await validateCriteria(fact.content, fact.acceptanceCriteria);
        for (const result of criteriaResults) {
            if (!result.passed) {
                errors.push(`Acceptance criterion "${result.criterionId}" failed validation: ${result.message}`);
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
export async function validateConditions(factId) {
    const errors = [];
    const fact = await prisma.fact.findUnique({
        where: { id: factId },
        include: { conditions: true }
    });
    if (!fact) {
        return { isValid: false, errors: ['Fact not found'] };
    }
    for (const condition of fact.conditions) {
        const targetFact = await prisma.fact.findUnique({
            where: { id: condition.targetId }
        });
        if (!targetFact) {
            errors.push(`Referenced fact '${condition.targetId}' not found`);
            continue;
        }
        if (condition.type === 'REQUIRES' && !targetFact.applicable) {
            errors.push(`Required fact '${condition.targetId}' is not applicable`);
        }
        if (condition.type === 'CONFLICTS_WITH' && targetFact.applicable) {
            errors.push(`Fact conflicts with active fact '${condition.targetId}'`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
export function validateFactConditions(factConditions, conditions) {
    for (const condition of conditions) {
        const factExists = factConditions.get(condition.factId) ?? false;
        if (condition.type === 'REQUIRES' && !factExists) {
            return false;
        }
        if (condition.type === 'CONFLICTS_WITH' && factExists) {
            return false;
        }
    }
    return true;
}
