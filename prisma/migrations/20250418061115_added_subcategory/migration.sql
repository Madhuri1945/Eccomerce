/*
  Warnings:

  - You are about to drop the `_ProductToSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `categoryId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSubCategory" DROP CONSTRAINT "_ProductToSubCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSubCategory" DROP CONSTRAINT "_ProductToSubCategory_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "subCategoryId" INTEGER,
ALTER COLUMN "categoryId" SET NOT NULL;

-- DropTable
DROP TABLE "_ProductToSubCategory";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
