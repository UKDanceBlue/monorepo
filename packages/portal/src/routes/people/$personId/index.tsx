import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people/$personId/')({
  component: () => <div>Hello /people/$personId/!</div>
})