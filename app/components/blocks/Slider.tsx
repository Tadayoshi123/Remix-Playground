interface SliderProps {
  data: {
    files?: {
      data?: Array<{
        id: number;
        attributes?: {
          url?: string;
          alternativeText?: string;
        };
      }>;
    };
  };
}

export default function Slider({ data }: SliderProps) {
  const images = data?.files?.data;
  
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="my-8 overflow-hidden">
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {images.map((image) => (
          <div key={image.id} className="flex-shrink-0 w-80">
            <img
              src={`http://localhost:1337${image.attributes?.url}`}
              alt={image.attributes?.alternativeText || ''}
              className="rounded-lg w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 