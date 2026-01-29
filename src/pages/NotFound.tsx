import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // This console.error is useful for development but should not be in production
    // as `location.pathname` could contain sensitive information.
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `404 Error: User attempted to access non-existent route: ${location.pathname}`,
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <p className="text-2xl font-semibold text-foreground mb-4">
            Page Not Found
          </p>
          <p className="text-lg text-muted-foreground">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <div>
          <Button
            asChild
            className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 text-lg">
            <a href="/bdc-real-estate/">Return to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
