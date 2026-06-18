'use client';

import { importProductsAction } from '@/features/productos/actions/importProducts';
import { ImportProductsResponse } from '@/features/productos/types/importProduct';
import { useState } from 'react';
import UploadStep from './UploadStep';
import ResultStep from './ResultStep';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ImportExcelModal({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<ImportProductsResponse | null>(null);

  if (!open) return null;

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();

    formData.append('file', file);

    const response = await importProductsAction(formData);

    setResult(response);

    setLoading(false);
  };

  const reset = () => {
    setFile(null);

    setResult(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-full max-w-xl">
        {!result ? (
          <UploadStep
            file={file}
            setFile={setFile}
            loading={loading}
            onImport={handleImport}
            onClose={onClose}
          />
        ) : (
          <ResultStep
            result={result}
            onClose={() => {
              reset();

              onClose();
            }}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
