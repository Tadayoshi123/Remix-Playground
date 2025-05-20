import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import Layout from "../components/Layout";

export const meta: MetaFunction = () => {
  return [
    { title: "Page Not Found - ArticleBlog" },
    { name: "description", content: "The page you're looking for doesn't exist." },
  ];
};

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          
          <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-6">
            Page Not Found
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
} 