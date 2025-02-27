// Enums
export var FactCategory;
(function (FactCategory) {
    // Architecture Layers
    FactCategory["FRONTEND"] = "FRONTEND";
    FactCategory["BACKEND"] = "BACKEND";
    FactCategory["DATABASE"] = "DATABASE";
    FactCategory["FULL_STACK"] = "FULL_STACK";
    // Development Patterns
    FactCategory["DESIGN_PATTERN"] = "DESIGN_PATTERN";
    FactCategory["ARCHITECTURE_PATTERN"] = "ARCHITECTURE_PATTERN";
    FactCategory["TESTING_PATTERN"] = "TESTING_PATTERN";
    // Code Organization
    FactCategory["NAMING_CONVENTION"] = "NAMING_CONVENTION";
    FactCategory["PROJECT_STRUCTURE"] = "PROJECT_STRUCTURE";
    FactCategory["CODE_STYLE"] = "CODE_STYLE";
    // Operations
    FactCategory["DEPLOYMENT"] = "DEPLOYMENT";
    FactCategory["CI_CD"] = "CI_CD";
    FactCategory["MONITORING"] = "MONITORING";
    FactCategory["SECURITY"] = "SECURITY";
    // Development Process
    FactCategory["GIT_WORKFLOW"] = "GIT_WORKFLOW";
    FactCategory["CODE_REVIEW"] = "CODE_REVIEW";
    FactCategory["DOCUMENTATION"] = "DOCUMENTATION";
    // Dependencies
    FactCategory["PACKAGE_MANAGEMENT"] = "PACKAGE_MANAGEMENT";
    FactCategory["VERSIONING"] = "VERSIONING";
    // Performance
    FactCategory["OPTIMIZATION"] = "OPTIMIZATION";
    FactCategory["CACHING"] = "CACHING";
    // Cross-cutting
    FactCategory["ACCESSIBILITY"] = "ACCESSIBILITY";
    FactCategory["INTERNATIONALIZATION"] = "INTERNATIONALIZATION";
    FactCategory["ERROR_HANDLING"] = "ERROR_HANDLING";
    // New categories
    FactCategory["TECHNICAL"] = "TECHNICAL";
    FactCategory["BUSINESS"] = "BUSINESS";
    FactCategory["COMPLIANCE"] = "COMPLIANCE";
})(FactCategory || (FactCategory = {}));
export var StrictnessLevel;
(function (StrictnessLevel) {
    StrictnessLevel["STRICT"] = "STRICT";
    StrictnessLevel["MODERATE"] = "MODERATE";
    StrictnessLevel["LENIENT"] = "LENIENT";
})(StrictnessLevel || (StrictnessLevel = {}));
export var ConditionType;
(function (ConditionType) {
    ConditionType["REQUIRES"] = "REQUIRES";
    ConditionType["CONFLICTS_WITH"] = "CONFLICTS_WITH";
})(ConditionType || (ConditionType = {}));
export var ValidationType;
(function (ValidationType) {
    ValidationType["MANUAL"] = "MANUAL";
    ValidationType["AUTOMATED"] = "AUTOMATED";
    ValidationType["URL_CHECK"] = "URL_CHECK";
})(ValidationType || (ValidationType = {}));
