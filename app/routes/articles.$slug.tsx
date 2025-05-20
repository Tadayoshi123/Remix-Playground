import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { getArticleBySlug, getArticleById } from "../services/strapi.server";
import Layout from "../components/Layout";
import DynamicZone from "../components/blocks";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.article) {
    return [
      { title: "Article Not Found - ArticleBlog" },
      { name: "description", content: "The requested article could not be found." },
    ];
  }

  const article = data.article.data;
  const title = typeof article === 'object' ? article.title || 'Article' : 'Article';
  const description = typeof article === 'object' ? article.description || '' : '';
  
  return [
    { title: `${title} - ArticleBlog` },
    { name: "description", content: description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    // Vérifier si le slug est un nombre (ID d'article)
    const isNumeric = /^\d+$/.test(slug);
    
    let article;
    if (isNumeric) {
      // Récupérer l'article par ID
      const id = parseInt(slug, 10);
      article = await getArticleById(id);
    } else {
      // Récupérer l'article par slug normal
      article = await getArticleBySlug(slug);
    }
    
    return json({ article });
  } catch (error) {
    console.error(`Error loading article with slug/id ${slug}:`, error);
    throw new Response("Not Found", { status: 404 });
  }
}

// Types pour les formats d'image
interface ImageFormat {
  url: string;
  [key: string]: unknown;
}

interface ImageFormats {
  thumbnail?: ImageFormat;
  small?: ImageFormat;
  medium?: ImageFormat;
  large?: ImageFormat;
  [key: string]: ImageFormat | undefined;
}

interface CoverImage {
  url?: string;
  formats?: ImageFormats;
  [key: string]: unknown;
}

export default function ArticleDetail() {
  const { article } = useLoaderData<typeof loader>();
  
  if (!article || !article.data) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Article introuvable</h1>
          <p className="text-gray-600">L&apos;article que vous recherchez n&apos;existe pas ou a été supprimé.</p>
        </div>
      </Layout>
    );
  }
  
  // L'article peut avoir deux formats différents selon la source
  // Extraction sécurisée des données
  const articleData = article.data;
  
  // Extraction des données avec gestion des deux formats possibles
  const title = articleData.title || '';
  const description = articleData.description || '';
  const publishedAt = articleData.publishedAt || '';
  
  const cover = articleData.cover as CoverImage | null || null;
  const author = articleData.author || null;
  const category = articleData.category || null;
  const blocks = Array.isArray(articleData.blocks) ? articleData.blocks : [];

  // Récupérer l'URL de l'image principale
  let imageUrl = '';
  if (cover) {
    if (cover.url) {
      imageUrl = cover.url;
    } else if (cover.formats) {
      const formats = cover.formats;
      imageUrl = 
        (formats.large?.url) || 
        (formats.medium?.url) || 
        (formats.small?.url) || 
        (formats.thumbnail?.url) || '';
    }
  }
  
  const fullImageUrl = imageUrl ? `http://localhost:1337${imageUrl}` : '/images/placeholder.jpg';
  
  const formattedDate = publishedAt ? 
    new Date(publishedAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Date inconnue';

  const authorName = author && typeof author === 'object' && 'name' in author ? author.name : '';
  const categoryName = category && typeof category === 'object' && 'name' in category ? category.name : '';

  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            {authorName && (
              <span className="mr-4">By {authorName}</span>
            )}
            <span className="mr-4">•</span>
            <time dateTime={publishedAt}>{formattedDate}</time>
            
            {categoryName && (
              <>
                <span className="mx-4">•</span>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {categoryName}
                </span>
              </>
            )}
          </div>
          
          <div className="rounded-lg overflow-hidden mb-8">
            <img 
              src={fullImageUrl}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {description}
            </p>
            
            {/* Affichage des blocs de contenu dynamiques */}
            {blocks && blocks.length > 0 ? (
              // @ts-expect-error - Les types exacts des blocs ne sont pas importants ici
              <DynamicZone blocks={blocks} />
            ) : (
              <div className="text-gray-600 italic">
                Cet article n&apos;a pas encore de contenu détaillé.
              </div>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
} 