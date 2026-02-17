import { getCategoryBySlug } from "@/lib/categories";

export default function CategoryBadge({ category }: { category: string }) {
  const cat = getCategoryBySlug(category);
  if (!cat) return null;

  return (
    <span className="text-xs text-muted">
      {cat.name}
      <span className="ml-0.5 text-[10px] text-accent-light">({cat.hanja})</span>
    </span>
  );
}
