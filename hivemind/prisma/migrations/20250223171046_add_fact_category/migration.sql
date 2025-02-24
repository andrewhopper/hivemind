-- Add category column as nullable first
PRAGMA foreign_keys=OFF;

-- Create new table with nullable category
CREATE TABLE "new_Fact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "strictness" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "minVersion" TEXT NOT NULL,
    "maxVersion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "applicable" BOOLEAN NOT NULL DEFAULT true,
    "content_embedding" TEXT
);

-- Copy existing data
INSERT INTO "new_Fact" ("applicable", "content", "content_embedding", "createdAt", "id", "maxVersion", "minVersion", "strictness", "type", "updatedAt") 
SELECT "applicable", "content", "content_embedding", "createdAt", "id", "maxVersion", "minVersion", "strictness", "type", "updatedAt" 
FROM "Fact";

-- Drop old table
DROP TABLE "Fact";
ALTER TABLE "new_Fact" RENAME TO "Fact";

-- Update existing records with appropriate categories
UPDATE "Fact" SET "category" = 'FRONTEND' WHERE "type" = 'styling';
UPDATE "Fact" SET "category" = 'FRAMEWORK' WHERE "type" = 'framework';

-- Make category required by creating new table
CREATE TABLE "new_Fact2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "strictness" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minVersion" TEXT NOT NULL,
    "maxVersion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "applicable" BOOLEAN NOT NULL DEFAULT true,
    "content_embedding" TEXT
);

-- Copy data with non-null categories
INSERT INTO "new_Fact2" SELECT * FROM "Fact";

-- Replace the table
DROP TABLE "Fact";
ALTER TABLE "new_Fact2" RENAME TO "Fact";

PRAGMA foreign_keys=ON;
