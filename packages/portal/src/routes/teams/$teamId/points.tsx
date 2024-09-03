import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teams/$teamId/points')({
  component: () => <div>Hello /teams/$teamId/points!</div>
})