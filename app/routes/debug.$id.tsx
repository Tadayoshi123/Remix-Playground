import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const STRAPI_URL = 'http://localhost:1337';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    return json({ error: "ID is required" });
  }

  try {
    // 1. Essayer avec GET /api/articles/:id?populate=*
    const directUrl = `${STRAPI_URL}/api/articles/${id}?populate=*`;
    
    console.log(`DEBUG: Fetching article directly from: ${directUrl}`);
    
    const directResponse = await fetch(directUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const directResult = directResponse.ok ? await directResponse.json() : { error: directResponse.statusText };
    
    // 2. Essayer avec GET /api/articles?filters[id][$eq]=:id&populate=*
    const filterUrl = `${STRAPI_URL}/api/articles?filters[id][$eq]=${id}&populate=*`;
    
    console.log(`DEBUG: Fetching article by filter from: ${filterUrl}`);
    
    const filterResponse = await fetch(filterUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const filterResult = filterResponse.ok ? await filterResponse.json() : { error: filterResponse.statusText };
    
    return json({
      id,
      directFetch: {
        url: directUrl,
        status: directResponse.status,
        response: directResult
      },
      filterFetch: {
        url: filterUrl,
        status: filterResponse.status,
        response: filterResult
      }
    });
  } catch (error) {
    console.error(`Error in debug route for ID '${id}':`, error);
    return json({ error: error instanceof Error ? error.message : String(error) });
  }
}

export default function DebugPage() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Article API Response</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Direct Fetch - /api/articles/{data.id}</h2>
        <div className="bg-gray-100 p-4 rounded mb-2">
          <p><strong>URL:</strong> {data.directFetch?.url}</p>
          <p><strong>Status:</strong> {data.directFetch?.status}</p>
        </div>
        
        <details open>
          <summary className="cursor-pointer font-medium p-2 bg-blue-50 rounded">Response</summary>
          <pre className="mt-2 p-4 bg-gray-800 text-white rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(data.directFetch?.response, null, 2)}
          </pre>
        </details>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Filter Fetch - /api/articles?filters[id]</h2>
        <div className="bg-gray-100 p-4 rounded mb-2">
          <p><strong>URL:</strong> {data.filterFetch?.url}</p>
          <p><strong>Status:</strong> {data.filterFetch?.status}</p>
        </div>
        
        <details open>
          <summary className="cursor-pointer font-medium p-2 bg-blue-50 rounded">Response</summary>
          <pre className="mt-2 p-4 bg-gray-800 text-white rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(data.filterFetch?.response, null, 2)}
          </pre>
        </details>
      </div>
      
      {'error' in data && (
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <h2 className="text-xl text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{data.error}</p>
        </div>
      )}
    </div>
  );
} 