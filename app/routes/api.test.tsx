import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface ApiTestResponse {
  apiUrl: string;
  response: {
    status: number;
    statusText: string;
    ok: boolean;
    headers: Record<string, string>;
  };
  data: any;
  error: string | null;
}

interface ApiTestError {
  error: string;
  stack?: string;
}

type LoaderData = ApiTestResponse | ApiTestError;

export async function loader() {
  try {
    const STRAPI_URL = 'http://localhost:1337';
    const apiUrl = `${STRAPI_URL}/api/articles?populate=*`;
    
    console.log(`Testing API connection to: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    const responseData = {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    };

    let data = null;
    let error = null;

    try {
      if (response.ok) {
        data = await response.json();
      } else {
        error = await response.text();
      }
    } catch (parseError) {
      error = `Error parsing response: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
    }

    return json<ApiTestResponse>({
      apiUrl,
      response: responseData,
      data,
      error,
    });
  } catch (error) {
    return json<ApiTestError>({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

export default function ApiTest() {
  const data = useLoaderData<typeof loader>();
  
  // Déterminer si l'objet est une erreur ou une réponse valide
  const hasApiUrl = 'apiUrl' in data;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      
      {hasApiUrl ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">API URL</h2>
            <div className="bg-gray-100 p-3 rounded">
              {data.apiUrl}
            </div>
          </div>
          
          {data.error && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <pre className="whitespace-pre-wrap">{data.error}</pre>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Response Info</h2>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>Status:</strong> {data.response.status} {data.response.statusText}</p>
              <p><strong>OK:</strong> {data.response.ok ? "Yes" : "No"}</p>
              <details>
                <summary className="cursor-pointer font-medium">Headers</summary>
                <pre className="mt-2 text-sm">{JSON.stringify(data.response.headers, null, 2)}</pre>
              </details>
            </div>
          </div>

          {data.data && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Response Data</h2>
              <details open>
                <summary className="cursor-pointer font-medium">Data (click to toggle)</summary>
                <pre className="mt-2 bg-gray-100 p-3 rounded overflow-auto max-h-96 text-sm">
                  {JSON.stringify(data.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <pre className="whitespace-pre-wrap">{data.error}</pre>
            {data.stack && (
              <details>
                <summary className="cursor-pointer font-medium mt-4">Stack Trace</summary>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{data.stack}</pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 