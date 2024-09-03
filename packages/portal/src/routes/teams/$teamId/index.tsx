import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teams/$teamId/')({
  component: () => <div>Hello /teams/$teamId/!</div>
})