"use client";

import React from 'react';

interface Props {
  status: {
    status: string;
    message: string;
    requirements?: string[];
  };
}

export default function NovaActStatus({ status }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Nova Act Status</h2>
      <div className="text-center">
        <div className="text-lg font-medium capitalize">{status.status}</div>
        <p className="text-sm text-gray-600 mt-2">{status.message}</p>
      </div>
    </div>
  );
}