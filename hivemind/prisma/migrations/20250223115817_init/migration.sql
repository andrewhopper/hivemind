-- CreateTable
CREATE TABLE "Fact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "strictness" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "minVersion" TEXT NOT NULL,
    "maxVersion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "applicable" BOOLEAN NOT NULL DEFAULT true,
    "content_embedding" TEXT
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "factId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    CONSTRAINT "Condition_factId_fkey" FOREIGN KEY ("factId") REFERENCES "Fact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AcceptanceCriterion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "factId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "validationType" TEXT NOT NULL,
    "validationScript" TEXT,
    CONSTRAINT "AcceptanceCriterion_factId_fkey" FOREIGN KEY ("factId") REFERENCES "Fact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
