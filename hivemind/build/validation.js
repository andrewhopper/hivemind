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
