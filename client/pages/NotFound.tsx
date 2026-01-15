import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8 p-6 rounded-2xl bg-primary/10">
        <div className="text-6xl font-bold text-primary">404</div>
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Page Not Found
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Sorry, the page you're looking for doesn't exist. It might have been removed or the URL might be incorrect.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        <Home className="w-5 h-5" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
