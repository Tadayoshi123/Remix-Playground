import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { getArticles } from "../services/strapi.server";
import ArticleGrid from "../components/ArticleGrid";
import Layout from "../components/Layout";

export const meta: MetaFunction = () => {
  return [
    { title: "All Articles - ArticleBlog" },
    { name: "description", content: "Browse all our articles" },
  ];
};

export async function loader() {
  try {
    const articles = await getArticles();
    return json({ articles });
  } catch (error) {
    console.error("Error loading articles:", error);
    return json({ articles: { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } } });
  }
}

export default function Articles() {
  const { articles } = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Articles</h1>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Found {articles.meta.pagination.total} article{articles.meta.pagination.total !== 1 ? 's' : ''}
            </p>
          </div>
          
          <ArticleGrid articles={articles.data} />
        </div>
      </div>
    </Layout>
  );
} 