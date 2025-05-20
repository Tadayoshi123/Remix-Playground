import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { getUserProfile, ErrorResponse } from "../services/strapi.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get token from URL query parameter
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  
  // For a real implementation, you'd use cookies or sessions to store the token
  // This is just a placeholder implementation
  if (!token) {
    // If no token is found, redirect to login
    return redirect("/login");
  }

  try {
    // Use the service function to get the user profile
    const userData = await getUserProfile(token);

    return json({ 
      user: userData,
      token 
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return redirect("/login");
  }
};

export default function Profile() {
  const { user, token } = useLoaderData<typeof loader>();

  // In a real app, you'd want to store the token in a cookie or session
  useEffect(() => {
    // Just to demonstrate that we have the token
    console.log("Token available:", token);
  }, [token]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">User Information</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              
              {user.firstName && (
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{user.firstName}</p>
                </div>
              )}
              
              {user.lastName && (
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{user.lastName}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <a
              href="/logout"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}