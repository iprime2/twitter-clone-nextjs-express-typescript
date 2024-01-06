"use client";

import React, { useEffect, useRef } from "react";

interface ClientComponentProps {
  children: React.ReactNode;
}

export function ClientComponent({ children }: ClientComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    // Add your client-side logic here

    return () => {
      // Clean up any resources if needed
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
