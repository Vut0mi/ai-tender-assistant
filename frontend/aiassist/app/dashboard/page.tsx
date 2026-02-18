"use client";

import { useState, useEffect, useRef } from 'react';
import TenderForm from '../components/TenderForm';
import RequirementsList from '../components/RequirementsList';
import NovaActStatus from '../components/NovaActStatus';
import SignaturePad from '../components/SignaturePad';
import toast, { Toaster } from 'react-hot-toast';

export default function Dashboard() {
  const [tenderUrl, setTenderUrl] = useState('');
  const [companyInfo, setCompanyInfo] = useState({
    company_name: '', registration_number: '', email: '', phone: ''
  });
  const [status, setStatus] = useState({
    status: 'idle', message: '', requirements: [], readyForSignature: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const clientId = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/${clientId.current}`);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type) {
        case 'navigating':
          setStatus(prev => ({ ...prev, status: 'navigating', message: data.data.status }));
          toast.loading('Navigating...');
          break;
        case 'requirements':
          setStatus(prev => ({ ...prev, status: 'requirements', requirements: data.data.requirements }));
          toast.success('Requirements found');
          break;
        case 'ready_for_signature':
          setStatus(prev => ({ ...prev, status: 'signature', readyForSignature: true }));
          setIsProcessing(false);
          toast.success('Ready for signature!');
          break;
        case 'error':
          setStatus(prev => ({ ...prev, status: 'error', message: data.data.error }));
          setIsProcessing(false);
          toast.error(data.data.error);
          break;
      }
    };

    return () => ws.current?.close();
  }, []);

  const startTenderProcess = async () => {
    setIsProcessing(true);
    try {
      await fetch('http://localhost:8000/api/start-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tenderUrl, ...companyInfo })
      });
    } catch (error) {
      toast.error('Failed to start');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">AI Tender Assistant</h1>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <TenderForm
              tenderUrl={tenderUrl}
              onUrlChange={setTenderUrl}
              companyInfo={companyInfo}
              onCompanyInfoChange={setCompanyInfo}
              onSubmit={startTenderProcess}
              isProcessing={isProcessing}
            />
            {status.requirements.length > 0 && (
              <RequirementsList requirements={status.requirements} />
            )}
            {status.readyForSignature && <SignaturePad onSign={() => toast.success('Signed!')} />}
          </div>
          <div>
            <NovaActStatus status={status} />
          </div>
        </div>
      </div>
    </div>
  );
}