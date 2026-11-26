interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ initials, size = "md", online = false, className = "" }: AvatarProps) {
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-full bg-[#DBEAFE] font-semibold text-[#2563EB] ring-1 ring-[#2563EB]/15 ${SIZE_MAP[size]}`}
      >
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#16A34A] ring-2 ring-white" />
      )}
    </div>
  );
}
