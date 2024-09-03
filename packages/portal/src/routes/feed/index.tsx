import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/feed/')({
  component: () => <div>Hello /feed/!</div>
})