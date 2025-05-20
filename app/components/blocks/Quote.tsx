interface QuoteProps {
  data: {
    quote?: string;
    author?: string;
  };
}

export default function Quote({ data }: QuoteProps) {
  if (!data?.quote) {
    return null;
  }

  return (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-8">
      <p className="text-xl font-serif italic text-gray-800">{data.quote}</p>
      {data.author && (
        <footer className="mt-2 text-right text-gray-600">
          — <cite>{data.author}</cite>
        </footer>
      )}
    </blockquote>
  );
} 