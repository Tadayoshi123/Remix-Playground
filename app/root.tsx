import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  let heading = "Une erreur est survenue";
  let message = "Désolé, une erreur inattendue s'est produite. Veuillez réessayer plus tard.";
  
  if (isRouteErrorResponse(error)) {
    heading = `${error.status} ${error.statusText}`;
    message = error.data || "Désolé, la page que vous cherchez n'existe pas ou a été déplacée.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Erreur | ArticleBlog</title>
      </head>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">{heading}</h1>
          <p className="text-gray-700 mb-6">{message}</p>
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Retour à l&apos;accueil
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
