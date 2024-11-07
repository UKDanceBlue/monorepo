-- DropForeignKey
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_batch_id_fkey";

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "DailyDepartmentNotificationBatch"("batch_id") ON DELETE CASCADE ON UPDATE CASCADE;
