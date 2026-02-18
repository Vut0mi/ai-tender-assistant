"use client";

import React from 'react';

interface Props {
  tenderUrl: string;
  onUrlChange: (url: string) => void;
  companyInfo: any;
  onCompanyInfoChange: (info: any) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export default function TenderForm({ 
  tenderUrl, onUrlChange, companyInfo, onCompanyInfoChange, onSubmit, isProcessing 
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Tender Details</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tender URL</label>
          <input
            type="url"
            value={tenderUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
            required
            disabled={isProcessing}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={companyInfo.company_name}
              onChange={(e) => onCompanyInfoChange({...companyInfo, company_name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
              required
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Number</label>
            <input
              type="text"
              value={companyInfo.registration_number}
              onChange={(e) => onCompanyInfoChange({...companyInfo, registration_number: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
              required
              disabled={isProcessing}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={companyInfo.email}
              onChange={(e) => onCompanyInfoChange({...companyInfo, email: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
              required
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={companyInfo.phone}
              onChange={(e) => onCompanyInfoChange({...companyInfo, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
              required
              disabled={isProcessing}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isProcessing ? 'Processing...' : 'Start Tender Application'}
        </button>
      </form>
    </div>
  );
}