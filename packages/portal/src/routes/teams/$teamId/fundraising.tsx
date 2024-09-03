import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teams/$teamId/fundraising')({
  component: () => <div>Hello /teams/$teamId/fundraising!</div>
})