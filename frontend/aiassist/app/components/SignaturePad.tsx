"use client";

import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface Props {
  onSign: (signature: string) => void;
}

export default function SignaturePad({ onSign }: Props) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => sigCanvas.current?.clear();
  const save = () => {
    if (sigCanvas.current) {
      onSign(sigCanvas.current.getTrimmedCanvas().toDataURL());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Sign to Submit</h2>
      <div className="border-2 border-gray-300 rounded-lg">
        <SignatureCanvas ref={sigCanvas} canvasProps={{ className: 'w-full h-48' }} />
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={clear} className="px-4 py-2 bg-gray-100 rounded-md">Clear</button>
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded-md">Submit</button>
      </div>
    </div>
  );
}