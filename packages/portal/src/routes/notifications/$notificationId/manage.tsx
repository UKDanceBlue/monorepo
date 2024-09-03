import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notifications/$notificationId/manage')({
  component: () => <div>Hello /notifications/$notificationId/manage!</div>
})