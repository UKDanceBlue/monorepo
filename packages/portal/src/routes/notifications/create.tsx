import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notifications/create')({
  component: () => <div>Hello /notifications/create!</div>
})