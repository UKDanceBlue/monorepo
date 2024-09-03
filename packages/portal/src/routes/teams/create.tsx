import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teams/create')({
  component: () => <div>Hello /teams/create!</div>
})