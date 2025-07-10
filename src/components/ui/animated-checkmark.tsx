
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AnimatedCheckmarkProps {
  className?: string;
  size?: number;
}

export function AnimatedCheckmark({ className, size = 32 }: AnimatedCheckmarkProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // We delay the animation slightly to ensure it's visible when the component mounts
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
      className={cn("transition-opacity duration-300", isMounted ? "opacity-100" : "opacity-0", className)}
      style={iconStyle}
    >
      <circle 
        cx="26" 
        cy="26" 
        r="25" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3"
        className="text-green-500/30"
      />
      <circle 
        cx="26" 
        cy="26" 
        r="25" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="4"
        className="text-green-500 transform-gpu origin-center -rotate-90"
        style={{
            strokeDasharray: 157, // Circumference of the circle
            strokeDashoffset: isMounted ? 0 : 157,
            transition: "stroke-dashoffset 0.5s ease-out",
        }}
      />
      <path 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="5"
        strokeLinecap="round"
        className="text-green-600"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
        style={{
            strokeDasharray: 50,
            strokeDashoffset: isMounted ? 0 : 50,
            transition: "stroke-dashoffset 0.4s ease-out 0.4s",
        }}
      />
    </svg>
  );
}
