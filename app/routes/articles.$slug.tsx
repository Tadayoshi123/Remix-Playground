import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { getArticleBySlug } from "../services/strapi.server";
import Layout from "../components/Layout";
import DynamicZone from "../components/blocks";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.article) {
    return [
      { title: "Article Not Found - ArticleBlog" },
      { name: "description", content: "The requested article could not be found." },
    ];
  }

  const { attributes } = data.article.data;
  
  return [
    { title: `${attributes.title} - ArticleBlog` },
    { name: "description", content: attributes.description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const article = await getArticleBySlug(slug);
    return json({ article });
  } catch (error) {
    console.error(`Error loading article with slug ${slug}:`, error);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function ArticleDetail() {
  const { article } = useLoaderData<typeof loader>();
  const { attributes } = article.data;
  
  const imageUrl = attributes.cover?.data?.attributes?.url;
  const fullImageUrl = imageUrl ? `http://localhost:1337${imageUrl}` : '/images/placeholder.jpg';
  
  const formattedDate = new Date(attributes.publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{attributes.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            {attributes.author?.data && (
              <span className="mr-4">By {attributes.author.data.attributes.name}</span>
            )}
            <span className="mr-4">•</span>
            <time dateTime={attributes.publishedAt}>{formattedDate}</time>
            
            {attributes.category?.data && (
              <>
                <span className="mx-4">•</span>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {attributes.category.data.attributes.name}
                </span>
              </>
            )}
          </div>
          
          <div className="rounded-lg overflow-hidden mb-8">
            <img 
              src={fullImageUrl}
              alt={attributes.title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {attributes.description}
            </p>
            
            {/* Render dynamic content blocks */}
            {attributes.blocks && attributes.blocks.length > 0 ? (
              <DynamicZone blocks={attributes.blocks} />
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