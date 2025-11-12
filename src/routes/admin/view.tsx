import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/view')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/view"!</div>
}
