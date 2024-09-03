import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marathon/$marathonId/')({
  component: () => <div>Hello /marathon/$marathonId/!</div>
})