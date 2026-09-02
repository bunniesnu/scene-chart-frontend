import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return <div className="flex flex-col items-center mx-auto min-h-screen w-screen max-w-3xl">
    <Outlet />
  </div>
}
