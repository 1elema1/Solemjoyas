import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = 'Imagen' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor seleccioná una imagen válida');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      // Magia de compresión para celulares
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800; // Tamaño máximo en píxeles

        // Calcular la nueva proporción sin deformar la foto
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Dibujar la imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir a JPEG con 70% de calidad para hacerla ultra liviana
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setPreview(compressedDataUrl);
          onChange(compressedDataUrl);
          setError('');
        }
      };
      img.src = dataUrl;
    };
    
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreview(url);
  };

  const handleClear = () => {
    onChange('');
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="uppercase block mb-2">
        {label}
      </label>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="url"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://… o subí una imagen"
            style={{
              flex: 1,
              border: '1px solid rgba(0,0,0,0.12)',
              padding: '11px 14px',
              fontSize: '0.82rem',
              background: 'transparent',
              color: '#1a1a1a',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '1px solid rgba(0,0,0,0.12)',
              padding: '11px 16px',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6B8F71',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.68rem',
              letterSpacing: '0.1em',
            }}
            className="uppercase hover:bg-black/5 transition-colors"
          >
            <Upload size={14} />
            Subir
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {error && (
          <div style={{
            backgroundColor: 'rgba(192,57,43,0.1)',
            border: '1px solid rgba(192,57,43,0.3)',
            padding: '10px 14px',
          }}>
            <p style={{ color: '#c0392b', fontSize: '0.75rem' }}>{error}</p>
          </div>
        )}

        {preview && (
          <div className="relative inline-block" style={{ maxWidth: '200px' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '2px',
                objectFit: 'contain',
              }}
            />
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              className="hover:bg-black transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
