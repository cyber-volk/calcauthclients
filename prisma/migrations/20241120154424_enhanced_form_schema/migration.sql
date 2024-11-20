/*
  Warnings:

  - You are about to drop the column `data` on the `Form` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "CreditRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalClient" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditRow_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CreditRow_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditPayeeRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalPayee" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditPayeeRow_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CreditPayeeRow_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DepenseRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "totalDepense" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DepenseRow_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DepenseRow_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RetraitRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "retraitPayee" TEXT NOT NULL,
    "retrait" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RetraitRow_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RetraitRow_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "initialCredit" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "ownerId" TEXT NOT NULL,
    "ownerRole" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Client_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("agentId", "createdAt", "email", "id", "initialCredit", "name", "notes", "ownerId", "ownerRole", "phone", "status", "updatedAt") SELECT "agentId", "createdAt", "email", "id", "initialCredit", "name", "notes", "ownerId", "ownerRole", "phone", "status", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE INDEX "Client_ownerId_idx" ON "Client"("ownerId");
CREATE INDEX "Client_agentId_idx" ON "Client"("agentId");
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "multiplier" TEXT NOT NULL DEFAULT '1.1',
    "fond" TEXT,
    "soldeALinstant" TEXT,
    "soldeDeDebut" TEXT,
    "result" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "agentId" TEXT,
    "parentFormId" TEXT,
    CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Form_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Form_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Form_parentFormId_fkey" FOREIGN KEY ("parentFormId") REFERENCES "Form" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("createdAt", "id", "name", "siteId", "updatedAt", "userId") SELECT "createdAt", "id", "name", "siteId", "updatedAt", "userId" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE INDEX "Form_userId_idx" ON "Form"("userId");
CREATE INDEX "Form_siteId_idx" ON "Form"("siteId");
CREATE INDEX "Form_agentId_idx" ON "Form"("agentId");
CREATE TABLE "new_Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT 'none',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT,
    CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Site_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Site" ("createdAt", "description", "id", "name", "updatedAt", "userId") SELECT "createdAt", "description", "id", "name", "updatedAt", "userId" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
CREATE INDEX "Site_userId_idx" ON "Site"("userId");
CREATE INDEX "Site_agentId_idx" ON "Site"("agentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CreditRow_formId_idx" ON "CreditRow"("formId");

-- CreateIndex
CREATE INDEX "CreditRow_clientId_idx" ON "CreditRow"("clientId");

-- CreateIndex
CREATE INDEX "CreditPayeeRow_formId_idx" ON "CreditPayeeRow"("formId");

-- CreateIndex
CREATE INDEX "CreditPayeeRow_clientId_idx" ON "CreditPayeeRow"("clientId");

-- CreateIndex
CREATE INDEX "DepenseRow_formId_idx" ON "DepenseRow"("formId");

-- CreateIndex
CREATE INDEX "DepenseRow_clientId_idx" ON "DepenseRow"("clientId");

-- CreateIndex
CREATE INDEX "RetraitRow_formId_idx" ON "RetraitRow"("formId");

-- CreateIndex
CREATE INDEX "RetraitRow_clientId_idx" ON "RetraitRow"("clientId");

-- CreateIndex
CREATE INDEX "User_agentId_idx" ON "User"("agentId");
