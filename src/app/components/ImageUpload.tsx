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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      onChange(dataUrl);
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
            placeholder="https://... o sube una imagen"
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

        {preview && (
          <div className="relative inline-block">
            <div
              className="overflow-hidden"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '2px',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
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
