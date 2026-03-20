import React from "react";
import { Card } from "antd";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <Card
      className="w-full max-w-md rounded-2xl shadow-md border border-gray-100"
      bodyStyle={{ padding: 32 }}
    >
      {title && (
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h1>
      )}

      {subtitle && <p className="text-center text-gray-500 mb-6">{subtitle}</p>}

      {children}
    </Card>
  );
}
