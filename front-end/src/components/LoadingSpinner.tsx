export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-[#00749C]/20`} />
        
        {/* Spinning gradient ring */}
        <div 
          className={`${sizeClasses[size]} absolute inset-0 rounded-full border-4 border-transparent border-t-[#00749C] border-r-[#00B7D3] animate-spin`}
          style={{
            animationDuration: "0.8s"
          }}
        />
      </div>
    </div>
  );
}
