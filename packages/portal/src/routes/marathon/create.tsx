import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marathon/create')({
  component: () => <div>Hello /marathon/create!</div>
})