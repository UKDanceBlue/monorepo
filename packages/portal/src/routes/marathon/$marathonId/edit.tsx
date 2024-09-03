import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marathon/$marathonId/edit')({
  component: () => <div>Hello /marathon/$marathonId/edit!</div>
})