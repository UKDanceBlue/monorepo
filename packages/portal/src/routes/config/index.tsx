import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/config/')({
  component: () => <div>Hello /config/!</div>
})