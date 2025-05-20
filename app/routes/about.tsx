import type { MetaFunction } from "@remix-run/node";
import Layout from "../components/Layout";

export const meta: MetaFunction = () => {
  return [
    { title: "About - ArticleBlog" },
    { name: "description", content: "About ArticleBlog - Learn more about our platform" },
  ];
};

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Welcome to ArticleBlog, your source for quality content on various topics. We aim to provide informative and engaging articles to our readers.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            Our mission is to create a platform where readers can find well-researched and thoughtfully written articles on topics that matter. We believe in the power of knowledge and aim to make it accessible to everyone.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            Our team consists of passionate writers, editors, and subject matter experts who work together to deliver high-quality content. Each member brings their unique perspective and expertise to the table.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            Have questions or suggestions? We&apos;d love to hear from you! Reach out to us at <a href="mailto:contact@articleblog.com" className="text-blue-600 hover:underline">contact@articleblog.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
} 