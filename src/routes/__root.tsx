import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vivek Transportt — Book a Truck for Your Parcel" },
      { name: "description", content: "India's logistics marketplace. Book verified trucks for parcels across 450+ cities, or list your truck and earn on a transparent commission." },
      { property: "og:title", content: "Vivek Transportt — Book a Truck for Your Parcel" },
      { property: "og:description", content: "India's logistics marketplace. Book verified trucks for parcels across 450+ cities, or list your truck and earn on a transparent commission." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Vivek Transportt — Book a Truck for Your Parcel" },
      { name: "twitter:description", content: "India's logistics marketplace. Book verified trucks for parcels across 450+ cities, or list your truck and earn on a transparent commission." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Tb0lDhWCUOMbrNQzMZyYovmEzD13/social-images/social-1780933880922-216724487.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Tb0lDhWCUOMbrNQzMZyYovmEzD13/social-images/social-1780933880922-216724487.webp" },
      { name: "google-site-verification", content: "4neu5dD40kgSAg2rb_uo4IHTl7p0eLM1kQzj4zg-N7U" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;600&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://vivektransportt.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Vivek Transportt",
          url: "https://vivektransportt.lovable.app/",
          email: "vivektransportt@gmail.com",
          telephone: "+91-9322662939",
          founder: { "@type": "Person", name: "Vivek Taware" },
          areaServed: { "@type": "State", name: "Maharashtra" },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Star Recidency, Malinagar 301",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Truck Booking & Logistics",
          provider: { "@type": "Organization", name: "Vivek Transportt" },
          areaServed: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Kolhapur", "Solapur"],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
