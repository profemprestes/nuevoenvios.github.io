"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [displayYear, setDisplayYear] = useState<string | number>(''); // Start with empty or placeholder

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setDisplayYear(new Date().getFullYear());
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>
          &copy; {displayYear || ''} NuevoEnvios. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
