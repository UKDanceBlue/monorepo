import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people/create')({
  component: () => <div>Hello /people/create!</div>
})