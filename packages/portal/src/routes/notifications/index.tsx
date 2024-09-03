import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notifications/')({
  component: () => <div>Hello /notifications/!</div>
})