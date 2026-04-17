export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-foreground/10 border-t-foreground/80 rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-widest uppercase opacity-50 animate-pulse">Initializing Engine</p>
      </div>
    </div>
  );
}
