"use client";

import React from 'react';

interface Props {
  requirements: string[];
}

export default function RequirementsList({ requirements }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
      <div className="space-y-3">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm text-gray-700">{req}</span>
          </div>
        ))}
      </div>
    </div>
  );
}