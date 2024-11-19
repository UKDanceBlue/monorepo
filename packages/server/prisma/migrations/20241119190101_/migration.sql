-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "DailyDepartmentNotificationBatch"("batchId") ON DELETE CASCADE ON UPDATE CASCADE;
