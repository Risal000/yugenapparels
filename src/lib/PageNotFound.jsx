export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-light text-foreground/10">404</h1>
          <div className="space-y-3">
            <h2 className="text-lg font-light tracking-wide text-foreground/60">
              Lost in the void
            </h2>
            <p className="text-xs tracking-wide text-foreground/25">
              The page you're looking for doesn't exist.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 border border-foreground/20 px-6 py-3 hover:bg-foreground hover:text-background transition-all duration-500"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
