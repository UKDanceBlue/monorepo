import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people/')({
  component: () => <div>Hello /people/!</div>
})