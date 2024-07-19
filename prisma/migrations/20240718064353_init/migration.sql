/*
  Warnings:

  - You are about to drop the `NoteTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NoteTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `note_id` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_NoteTags_B_index";

-- DropIndex
DROP INDEX "_NoteTags_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NoteTags";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_NoteTags";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "note_id" INTEGER NOT NULL,
    CONSTRAINT "Tag_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Note" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tag" ("id", "name") SELECT "id", "name" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
