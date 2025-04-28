/*
  Warnings:

  - Added the required column `source` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "token" TEXT NOT NULL,
    "source" TEXT NOT NULL
);
INSERT INTO "new_RefreshToken" ("token") SELECT "token" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_source_key" ON "RefreshToken"("source");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
