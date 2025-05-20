import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
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
        
        {/* Notice d'information sur les liens directs */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Accès direct aux articles</h3>
          <p className="text-blue-600 mb-2">
            Vous pouvez accéder directement aux articles par leur ID:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
            {articles.data.map(article => (
              <Link 
                key={article.id}
                to={`/articles/${article.id}`}
                className="px-3 py-2 bg-white rounded shadow-sm hover:shadow-md transition-shadow text-center"
              >
                Article #{article.id}: {article.title.substring(0, 15)}{article.title.length > 15 ? '...' : ''}
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm text-blue-500">
              Pour déboguer la réponse de l&apos;API, essayez <Link to={`/debug/${articles.data[0]?.id || 15}`} className="underline">cette page</Link>.
            </p>
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
