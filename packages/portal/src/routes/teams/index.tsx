import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teams/')({
  component: () => <div>Hello /teams/!</div>
})