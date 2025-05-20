interface RichTextProps {
  data: {
    content?: string;
  };
}

export default function RichText({ data }: RichTextProps) {
  if (!data?.content) {
    return null;
  }

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  );
} 