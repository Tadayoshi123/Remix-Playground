import { Link } from "@remix-run/react";
import type { Article } from "../services/strapi.server";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  if (!article) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-gray-500">Article information unavailable</p>
      </div>
    );
  }

  const { title = "Untitled", description = "", slug = "#", cover, category, author } = article;
  
  const imageUrl = cover?.formats?.thumbnail?.url || cover?.url;
  const fullImageUrl = imageUrl ? `http://localhost:1337${imageUrl}` : '/images/placeholder.jpg';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative pb-[60%]">
        <img 
          src={fullImageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {category && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {category.name || 'Uncategorized'}
          </span>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          {author && (
            <span className="text-sm text-gray-500">
              By {author.name || 'Unknown'}
            </span>
          )}
          
          <Link 
            to={`/articles/${slug || '#'}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Read more
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 