import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from '@/components/ui/separator';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return <div className="flex flex-col mx-auto min-h-screen w-screen max-w-3xl pt-4">
    <NavigationMenu align="start" className="flex-0 pb-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            to="/"
            className={navigationMenuTriggerStyle()}
            activeProps={{
              className: "bg-accent text-accent-foreground",
            }}
          >
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            to="/history"
            className={navigationMenuTriggerStyle()}
            activeProps={{
              className: "bg-accent text-accent-foreground",
            }}
          >
            History
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <Separator />
    <Outlet />
  </div>
}
