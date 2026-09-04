import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return <div className="flex flex-col mx-auto min-h-screen w-screen max-w-3xl">
    <div className="flex flex-row items-center justify-between gap-4 p-4">
      <NavigationMenu align="start">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to="/"
              className={navigationMenuTriggerStyle()}
              activeProps={{
                className: "bg-accent text-accent-foreground",
              }}
              search={{ chartType: "top100" }}
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
              search={{ chartType: "top100" }}
            >
              History
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ModeToggle />
    </div>
    <Separator />
    <Outlet />
  </div>
}
