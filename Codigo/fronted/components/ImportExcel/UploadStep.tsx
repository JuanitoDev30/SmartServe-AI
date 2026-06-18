'use client';

interface Props {
  file: File | null;
  setFile: (file: File) => void;
  loading: boolean;
  onImport: () => void;
  onClose: () => void;
}

export default function UploadStep({
  file,
  setFile,
  loading,
  onImport,
  onClose,
}: Props) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Importar productos</h2>

      <p className="text-gray-500 mt-1">Selecciona un archivo Excel.</p>

      <div className="mt-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={e => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>

      {file && (
        <div className="mt-4">
          <p>
            <strong>Archivo:</strong> {file.name}
          </p>

          <p>
            <strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-8">
        <button onClick={onClose}>Cancelar</button>

        <button disabled={!file || loading} onClick={onImport}>
          {loading ? 'Importando...' : 'Importar'}
        </button>
      </div>
    </div>
  );
}
