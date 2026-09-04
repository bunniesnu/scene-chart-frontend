import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { toast, Toaster } from "@/components/ui/toast"

import { routeTree } from '@/routeTree.gen'
import { ThemeProvider } from "@/components/theme-provider";
import { defaultStaleTime } from "@/const";

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: defaultStaleTime,
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error.detail) {
        toast.add({
          type: "error",
          description: error.detail,
          priority: "low",
        })
      }
      console.log("Query error:", error.detail);
    },
  }),
})

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
