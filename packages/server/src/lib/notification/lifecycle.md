# Notification Lifecycle

1. The client sends a GraphQL mutation to send a notification
2. The server creates a basic Notification row in the database
3. The server figures out the list of devices to send the notification to
4. The server creates a `NotificationDelivery` row for each device
5. The server chunks the notifications into groups of 100 and sends them to Expo
6. After each chunk is sent the `chunkUuid` (generated ourselves), `receiptId`
   and `sentAt` are stored in the `NotificationDelivery` rows
7. If there was an issue with the entire process, the server will update the
   Notification row with the error
8. If there are any immediate errors (like an unsubscribed device) on the push
   tickets, the server will handle them (for example by removing the offending
   push token from the device) and store the error along with the
   `NotificationDelivery` row
9. The admin portal will show an indeterminate status for each delivery until
   the server has received the receipts from Expo
10. The server will periodically poll Expo for the status of the receipts
11. The server will update the `NotificationDelivery` rows with the status of
    the receipts
12. The admin portal will now show the actual status of each delivery
