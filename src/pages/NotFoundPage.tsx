import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-4">
      <div className="text-6xl font-extrabold text-primary">404</div>
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        Go Back to Question Bank
      </Link>
    </div>
  );
};
