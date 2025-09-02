import React from "react";

export function Card({ children, className = "", noPadding = false, ...props }) {
  return (
    <div
      className={`rounded-2xl shadow-md bg-white transition-transform hover:scale-105 hover:shadow-xl ${
        noPadding ? "" : "p-6"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div
      className={`mb-4 text-xl font-semibold text-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`text-gray-600 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`mt-4 flex items-center justify-end space-x-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
