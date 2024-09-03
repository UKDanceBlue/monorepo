import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marathon/$marathonId/hours/$hourId/')({
  component: () => <div>Hello /marathon/$marathonId/hours/$hourId/!</div>
})