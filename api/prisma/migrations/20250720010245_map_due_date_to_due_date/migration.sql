/*
  Warnings:

  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - Added the required column `due_date` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `dueDate`,
    ADD COLUMN `due_date` DATETIME(3) NOT NULL;
