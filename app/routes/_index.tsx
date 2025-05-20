import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { getArticles, type ArticleResponse } from "../services/strapi.server";
import ArticleGrid from "../components/ArticleGrid";
import Layout from "../components/Layout";

export const meta: MetaFunction = () => {
  return [
    { title: "ArticleBlog - Home" },
    { name: "description", content: "Discover our latest articles and insights" },
  ];
};

export async function loader() {
  try {
    console.log("Fetching articles from Strapi...");
    const articles = await getArticles();
    console.log("Response from Strapi:", JSON.stringify(articles, null, 2));
    return json({ 
      articles, 
      debugInfo: JSON.stringify(articles, null, 2) 
    });
  } catch (error) {
    console.error("Error loading articles:", error);
    // Créer une réponse vide compatible avec la structure d'ArticleResponse
    const emptyResponse: ArticleResponse = {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 10,
          pageCount: 0,
          total: 0
        }
      }
    };
    
    return json({ 
      articles: emptyResponse,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const articles = data.articles;
  
  // Log des données récupérées
  console.log('Articles data:', articles);
  
  return (
    <Layout>
      <section className="mb-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ArticleBlog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our latest articles and insights on various topics
          </p>
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {articles.data.length} articles trouvés
          </div>
        </div>
        
        <ArticleGrid articles={articles.data || []} />
        
        {'error' in data && data.error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-600">Error loading articles</h3>
            <p className="text-red-700">{data.error}</p>
          </div>
        )}
        
        {'debugInfo' in data && data.debugInfo && (
          <details className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <summary className="text-lg font-semibold text-gray-700 cursor-pointer">API Response Debug</summary>
            <pre className="mt-2 p-2 bg-gray-100 overflow-auto text-sm">{data.debugInfo}</pre>
          </details>
        )}
      </section>
    </Layout>
  );
}
