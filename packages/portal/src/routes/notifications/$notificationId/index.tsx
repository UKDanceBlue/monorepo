import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notifications/$notificationId/')({
  component: () => <div>Hello /notifications/$notificationId/!</div>
})