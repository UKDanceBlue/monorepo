import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/images/')({
  component: () => <div>Hello /images/!</div>
})