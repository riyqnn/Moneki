interface WorkCardProps {
  title: string;
  desc: string;
  img?: string;
}

export default function WorkCard({ title, desc, img }: WorkCardProps) {
  return (
    <div className="bg-custom2 p-12 rounded-2xl hover:-translate-y-1 transition h-full grid grid-rows-[auto_1fr] gap-4 text-left">
      
      {/* Header + Image */}
      <div className="grid gap-4">
        {img && (
          <img
            src={img}
            alt={title}
            className="w-16 h-16 object-contain"
          />
        )}
        <h3 className="text-2xl font-bold text-custom3">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-custom3/80 text-base leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
