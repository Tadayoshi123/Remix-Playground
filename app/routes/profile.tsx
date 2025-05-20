import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserProfile } from "../services/strapi.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get token from URL query parameter
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  
  console.log("Profile loader - Token from URL:", token ? "Token exists" : "No token");
  
  // For a real implementation, you'd use cookies or sessions to store the token
  // This is just a placeholder implementation
  if (!token) {
    // If no token is found, redirect to login
    console.log("Profile loader - No token, redirecting to login");
    return redirect("/login");
  }

  try {
    // Use the service function to get the user profile
    console.log("Profile loader - Fetching user profile with token");
    const userData = await getUserProfile(token);
    
    console.log("Profile loader - User data received:", JSON.stringify(userData, null, 2));

    // Directly return the user data as the response
    return json(userData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return redirect("/login");
  }
};

export default function Profile() {
  const userData = useLoaderData<typeof loader>();
  
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
                <p className="font-medium">{userData.username}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium">{userData.id}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-medium">{userData.provider}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Account Status</p>
                <p className="font-medium">{userData.confirmed ? 'Confirmed' : 'Not Confirmed'}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
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