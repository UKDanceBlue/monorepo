import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/marathon/')({
  component: () => <div>Hello /marathon/!</div>
})