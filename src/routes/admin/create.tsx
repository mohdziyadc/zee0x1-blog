import { LexicalEditor } from '@/components/LexicalEditor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <h2 className="text-xl font-bold">Write ahead</h2>
    <main className='mt-8'>
        <LexicalEditor />
    </main>
  </div>
}
