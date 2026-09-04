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

function isApiError(error: Error): error is Error & { detail: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof error.detail === "string"
  );
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
      if (!isApiError(error)) {
        console.error("Query error:", error);
        return;
      }
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
