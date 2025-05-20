import { Article } from "../services/strapi.server";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[] | null | undefined;
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700">No articles found</h3>
          <p className="text-gray-500 mt-2">Please check back later for new content.</p>
        </div>
      </div>
    );
  }

  // Débogage: afficher les articles récupérés
  console.log(`Rendering ${articles.length} articles:`, articles);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
} 