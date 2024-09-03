import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people/$personId/edit')({
  component: () => <div>Hello /people/$personId/edit!</div>
})