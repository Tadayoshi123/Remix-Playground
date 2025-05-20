import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // In a real implementation, you would:
  // 1. Clear the auth token from cookies or session
  // 2. Possibly call Strapi logout endpoint if needed
  
  // For this implementation, we're just clearing the URL parameter
  // by redirecting to the login page
  return redirect("/login");
};

export default function Logout() {
  // This component will not be rendered as the loader will redirect
  return null;
}