import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marathon/$marathonId/hours/add')({
  component: () => <div>Hello /marathon/$marathonId/hours/add!</div>
})