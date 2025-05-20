import RichText from "./RichText";
import Media from "./Media";
import Quote from "./Quote";
import Slider from "./Slider";

interface Block {
  __component?: string;
  type?: string;
  [key: string]: unknown;
}

interface DynamicZoneProps {
  blocks: Block[];
}

export default function DynamicZone({ blocks }: DynamicZoneProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        // Déterminer le type de composant à rendre en fonction du type de bloc
        const componentType = block.__component || block.type;
        
        if (!componentType) {
          console.warn("Bloc sans type défini", block);
          return null;
        }
        
        switch (componentType) {
          case "shared.rich-text":
            return <RichText key={index} data={block} />;
          case "shared.media":
            return <Media key={index} data={block} />;
          case "shared.quote":
            return <Quote key={index} data={block} />;
          case "shared.slider":
            return <Slider key={index} data={block} />;
          default:
            console.warn(`Type de bloc non pris en charge: ${componentType}`);
            return null;
        }
      })}
    </div>
  );
} 