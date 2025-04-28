/*
  Warnings:

  - You are about to drop the column `token` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `accessToken` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "refreshToken" TEXT,
    "accessToken" TEXT NOT NULL,
    "source" TEXT NOT NULL
);
INSERT INTO "new_RefreshToken" ("source") SELECT "source" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_source_key" ON "RefreshToken"("source");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
