import { cn } from "@/lib/utils";

interface TagChipProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
}

export default function TagChip({ tag, onClick, active = false }: TagChipProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        onClick && "cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800",
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      )}
    >
      #{tag}
    </Component>
  );
}
