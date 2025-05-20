interface MediaProps {
  data: {
    file?: {
      data?: {
        attributes?: {
          url?: string;
          alternativeText?: string;
          width?: number;
          height?: number;
        };
      };
    };
    caption?: string;
  };
}

export default function Media({ data }: MediaProps) {
  const fileData = data?.file?.data?.attributes;
  const imageUrl = fileData?.url ? `http://localhost:1337${fileData.url}` : '';
  const altText = fileData?.alternativeText || 'Media image';

  if (!imageUrl) {
    return null;
  }

  return (
    <figure className="my-8">
      <img 
        src={imageUrl} 
        alt={altText}
        className="w-full h-auto rounded-lg"
      />
      {data.caption && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
} 