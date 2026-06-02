import { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Minus, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, AlertCircle, Image } from 'lucide-react';
import { useStore, Product, Variant } from '../context/StoreContext';
import { ImageUpload } from './ImageUpload';

const CATEGORIES = ['Anillos', 'Collares', 'Pulseras', 'Dijes', 'Aros', 'Abridores', 'Argollas'];

const DEFAULT_VARIANTS: Record<string, string[]> = {
  Anillos: ['12', '13', '14', '15', '16', '17', '18', '19'],
  Collares: ['40cm', '42cm', '45cm', '50cm'],
  Pulseras: ['16cm', '17cm', '18cm', '19cm', '20cm'],
  Argollas: ['20mm', '25mm', '30mm', '40mm'],
  Aros: ['Única'],
  Dijes: ['Única'],
  Abridores: ['Única'],
};

function statusInfo(product: Product) {
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const hasStock = totalStock > 0;
  if (!product.active) return { label: 'Inactivo', color: '#aaa', bg: 'rgba(0,0,0,0.05)', reason: 'desactivado manualmente' };
  if (!hasStock) return { label: 'Sin stock', color: '#c0392b', bg: 'rgba(192,57,43,0.08)', reason: 'stock agotado — inactivo en tienda' };
  return { label: 'Activo', color: '#6B8F71', bg: 'rgba(107,143,113,0.1)', reason: '' };
}

// ── Toggle component ──────────────────────────────────────────────────────────
function ActiveToggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      title={active ? 'Click para desactivar' : 'Click para activar'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 0',
      }}
    >
      {active
        ? <ToggleRight size={26} style={{ color: '#6B8F71' }} />
        : <ToggleLeft size={26} style={{ color: '#ccc' }} />
      }
      <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: active ? '#6B8F71' : '#aaa' }} className="uppercase">
        {active ? 'Activo' : 'Inactivo'}
      </span>
    </button>
  );
}

// ── Expandable product row in admin list ──────────────────────────────────────
function AdminProductRow({ product }: { product: Product }) {
  const { toggleActive, updateProduct, deleteProduct } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [localVariants, setLocalVariants] = useState<Variant[]>(product.variants);
  const [saved, setSaved] = useState(false);

  const totalStock = localVariants.reduce((s, v) => s + v.stock, 0);
  const status = statusInfo(product);

  const handleStockChange = (label: string, delta: number) => {
    setLocalVariants(prev =>
      prev.map(v => v.label === label ? { ...v, stock: Math.max(0, v.stock + delta) } : v)
    );
  };

  const handleStockInput = (label: string, val: string) => {
    const n = parseInt(val);
    if (isNaN(n) || n < 0) return;
    setLocalVariants(prev => prev.map(v => v.label === label ? { ...v, stock: n } : v));
  };

  const saveStock = () => {
    updateProduct(product.id, { variants: localVariants });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isSingle = product.variants.length === 1 && product.variants[0].label === 'Única';

  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.55)', border: '1px solid rgba(0,0,0,0.07)', marginBottom: '8px' }}>
      {/* Row summary */}
      <div className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0 overflow-hidden" style={{ width: '60px', height: '60px', borderRadius: '1px' }}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p style={{ color: '#1a1a1a', fontSize: '0.88rem' }}>{product.name}</p>
            <span
              style={{
                backgroundColor: status.bg,
                color: status.color,
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                padding: '2px 8px',
              }}
              className="uppercase flex-shrink-0"
            >
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span style={{ color: '#6B8F71', fontSize: '0.82rem' }}>${product.price.toLocaleString('es-AR')}</span>
            <span style={{ color: '#aaa', fontSize: '0.72rem', letterSpacing: '0.06em' }} className="uppercase">{product.category}</span>
            <span style={{ color: totalStock === 0 ? '#c0392b' : '#888', fontSize: '0.72rem' }}>
              Stock total: {totalStock}
            </span>
          </div>
          {totalStock === 0 && product.active && (
            <div className="flex items-center gap-1 mt-1">
              <AlertCircle size={11} style={{ color: '#c0392b' }} />
              <span style={{ color: '#c0392b', fontSize: '0.65rem' }}>Sin stock — aparece como inactivo en tienda</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <ActiveToggle active={product.active} onChange={() => toggleActive(product.id)} />

          <button
            onClick={() => setExpanded(v => !v)}
            style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
            title="Editar stock"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button
            onClick={() => deleteProduct(product.id)}
            style={{ color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}
            className="hover:text-red-400 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Expanded: variant stock editor */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '16px 20px', backgroundColor: 'rgba(0,0,0,0.015)' }}>
          <p style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.18em' }} className="uppercase mb-4">
            Stock por variante
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {localVariants.map(v => (
              <div key={v.label} style={{ border: '1px solid rgba(0,0,0,0.1)', padding: '10px 12px' }}>
                <p style={{ color: '#555', fontSize: '0.72rem', letterSpacing: '0.06em', marginBottom: '8px' }}>{v.label}</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStockChange(v.label, -1)}
                    style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '3px 7px', background: 'none', cursor: 'pointer', color: '#666' }}
                    className="hover:bg-black/5"
                  >
                    <Minus size={10} />
                  </button>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={e => handleStockInput(v.label, e.target.value)}
                    min={0}
                    style={{
                      width: '44px',
                      textAlign: 'center',
                      border: '1px solid rgba(0,0,0,0.12)',
                      padding: '3px 4px',
                      fontSize: '0.82rem',
                      color: v.stock === 0 ? '#c0392b' : '#1a1a1a',
                      background: 'transparent',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleStockChange(v.label, 1)}
                    style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '3px 7px', background: 'none', cursor: 'pointer', color: '#666' }}
                    className="hover:bg-black/5"
                  >
                    <Plus size={10} />
                  </button>
                </div>
                {v.stock === 0 && (
                  <p style={{ color: '#c0392b', fontSize: '0.58rem', marginTop: '4px' }}>Sin stock</p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={saveStock}
            style={{
              backgroundColor: saved ? '#6B8F71' : '#1a1a1a',
              color: 'white',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              padding: '9px 20px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            className="uppercase"
          >
            {saved ? '✓ Guardado' : 'Guardar stock'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Variant builder inside add-product form ────────────────────────────────────
function VariantBuilder({
  variants,
  onChange,
}: {
  variants: Variant[];
  onChange: (v: Variant[]) => void;
}) {
  const updateLabel = (i: number, label: string) => {
    const next = [...variants];
    next[i] = { ...next[i], label };
    onChange(next);
  };
  const updateStock = (i: number, stock: string) => {
    const n = Math.max(0, parseInt(stock) || 0);
    const next = [...variants];
    next[i] = { ...next[i], stock: n };
    onChange(next);
  };
  const add = () => onChange([...variants, { label: '', stock: 0 }]);
  const remove = (i: number) => onChange(variants.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex flex-col gap-2 mb-3">
        {variants.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={v.label}
              onChange={e => updateLabel(i, e.target.value)}
              placeholder="Ej: 40cm, Talla 15, Única…"
              style={{
                flex: 1,
                border: '1px solid rgba(0,0,0,0.12)',
                padding: '8px 12px',
                fontSize: '0.82rem',
                background: 'transparent',
                color: '#1a1a1a',
                outline: 'none',
              }}
            />
            <input
              type="number"
              value={v.stock}
              onChange={e => updateStock(i, e.target.value)}
              placeholder="Stock"
              min={0}
              style={{
                width: '80px',
                border: '1px solid rgba(0,0,0,0.12)',
                padding: '8px 10px',
                fontSize: '0.82rem',
                background: 'transparent',
                color: '#1a1a1a',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              style={{ color: '#ccc', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-red-400 transition-colors flex-shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        style={{
          fontSize: '0.65rem',
          letterSpacing: '0.12em',
          color: '#6B8F71',
          border: '1px dashed #6B8F71',
          padding: '7px 14px',
          background: 'none',
          cursor: 'pointer',
        }}
        className="uppercase hover:bg-green-50/30 transition-colors"
      >
        + Agregar variante
      </button>
    </div>
  );
}

// ── Carousel Manager ───────────────────────────────────────────────────────────
function CarouselManager() {
  const { carouselImages, updateCarouselImages } = useStore();
  const [tempImages, setTempImages] = useState(carouselImages);
  const [saved, setSaved] = useState(false);

  const addImage = (url: string) => {
    if (url.trim()) {
      setTempImages([...tempImages, url]);
    }
  };

  const removeImage = (idx: number) => {
    setTempImages(tempImages.filter((_, i) => i !== idx));
  };

  const save = () => {
    updateCarouselImages(tempImages);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h3
        style={{
          fontFamily: '"Cormorant Garamond","Georgia",serif',
          fontSize: '1.6rem',
          color: '#1a1a1a',
          fontWeight: 300,
          marginBottom: '16px',
        }}
      >
        Carrusel de Inicio
      </h3>
      <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '20px' }}>
        Gestiona las imágenes que se mostrarán en el carrusel de la página principal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {tempImages.map((img, idx) => (
          <div key={idx} className="relative">
            <div
              className="overflow-hidden"
              style={{
                aspectRatio: '16/9',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <img src={img} alt={`Carousel ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => removeImage(idx)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              className="hover:bg-black transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <ImageUpload
        value=""
        onChange={addImage}
        label="Agregar nueva imagen al carrusel"
      />

      <button
        onClick={save}
        style={{
          backgroundColor: saved ? '#6B8F71' : '#1a1a1a',
          color: 'white',
          fontSize: '0.68rem',
          letterSpacing: '0.15em',
          padding: '12px 24px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px',
          transition: 'background-color 0.3s',
        }}
        className="uppercase"
      >
        {saved ? '✓ Guardado' : 'Guardar carrusel'}
      </button>
    </div>
  );
}

// ── Main admin panel ───────────────────────────────────────────────────────────
export function AdminPanel() {
  const { products, addProduct, setCurrentView } = useStore();
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'carousel'>('list');
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const emptyForm = { name: '', price: '', category: 'Anillos', image: '', description: '', variants: [] as Variant[] };
  const [form, setForm] = useState(emptyForm);

  const handleCategoryChange = (cat: string) => {
    setForm(f => ({
      ...f,
      category: cat,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.price || !form.image.trim()) {
      setError('Completá nombre, precio e imagen');
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) { setError('Precio inválido'); return; }

    let variants = form.variants;
    if (variants.length === 0) {
      variants = [{ label: 'Única', stock: 10 }];
    } else if (variants.some(v => !v.label.trim())) {
      setError('Completá todas las variantes o dejá la sección vacía para producto sin variantes');
      return;
    }

    addProduct({ name: form.name, price, category: form.category, image: form.image, description: form.description, variants, active: true });
    setSuccess(`"${form.name}" agregado.`);
    setForm(emptyForm);
    setTimeout(() => setSuccess(''), 3000);
    setActiveTab('list');
  };

  const filtered = filterCat ? products.filter(p => p.category === filterCat) : products;
  const outOfStockCount = products.filter(p => p.variants.every(v => v.stock === 0)).length;

  return (
    <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">

        <button
          onClick={() => setCurrentView('home')}
          style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.15em', background: 'none', border: 'none', cursor: 'pointer' }}
          className="uppercase flex items-center gap-2 mb-10 hover:opacity-60 transition-opacity"
        >
          <ArrowLeft size={12} /> Volver a la tienda
        </button>

        {/* Header */}
        <div className="mb-10">
          <p style={{ color: '#6B8F71', fontSize: '0.65rem', letterSpacing: '0.25em' }} className="uppercase mb-3">
            Panel de administración
          </p>
          <h1
            style={{
              fontFamily: '"Cormorant Garamond","Georgia",serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#1a1a1a',
              fontWeight: 300,
            }}
          >
            Gestión de productos
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total productos', value: products.length },
            { label: 'Activos', value: products.filter(p => p.active && p.variants.some(v => v.stock > 0)).length },
            { label: 'Sin stock', value: outOfStockCount, alert: outOfStockCount > 0 },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.07)', padding: '16px 20px' }}>
              <p style={{ color: '#aaa', fontSize: '0.62rem', letterSpacing: '0.15em' }} className="uppercase mb-2">{s.label}</p>
              <p style={{ fontFamily: '"Cormorant Garamond","Georgia",serif', fontSize: '2.2rem', color: s.alert ? '#c0392b' : '#1a1a1a', fontWeight: 300, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }} className="flex gap-8 mb-10">
          {([['list', `Productos (${products.length})`], ['add', 'Agregar producto'], ['carousel', 'Carrusel']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                color: activeTab === tab ? '#6B8F71' : '#888',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #6B8F71' : '2px solid transparent',
                paddingBottom: '14px',
                cursor: 'pointer',
              }}
              className="uppercase"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Product list ── */}
        {activeTab === 'list' && (
          <div>
            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[null, ...CATEGORIES].map(cat => (
                <button
                  key={cat ?? 'all'}
                  onClick={() => setFilterCat(cat)}
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    padding: '6px 14px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    backgroundColor: filterCat === cat ? '#1a1a1a' : 'transparent',
                    color: filterCat === cat ? '#F5F0E8' : '#555',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  className="uppercase"
                >
                  {cat ?? 'Todos'}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p style={{ color: '#ccc', fontSize: '2rem', marginBottom: '12px' }}>✦</p>
                <p style={{ color: '#aaa', fontSize: '0.88rem' }}>No hay productos en esta categoría.</p>
              </div>
            ) : (
              <div>
                {filtered.map(p => <AdminProductRow key={p.id} product={p} />)}
              </div>
            )}
          </div>
        )}

        {/* ── Add product form ── */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-6">

            <div>
              <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="uppercase block mb-2">Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej: Anillo Corazón Delicado"
                required
                style={{ width: '100%', border: '1px solid rgba(0,0,0,0.12)', padding: '11px 14px', fontSize: '0.88rem', background: 'transparent', color: '#1a1a1a', outline: 'none' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="uppercase block mb-2">Precio (ARS) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="4500"
                  min={1}
                  required
                  style={{ width: '100%', border: '1px solid rgba(0,0,0,0.12)', padding: '11px 14px', fontSize: '0.88rem', background: 'transparent', color: '#1a1a1a', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="uppercase block mb-2">Categoría *</label>
                <select
                  value={form.category}
                  onChange={e => handleCategoryChange(e.target.value)}
                  style={{ width: '100%', border: '1px solid rgba(0,0,0,0.12)', padding: '11px 14px', fontSize: '0.88rem', background: '#F5F0E8', color: '#1a1a1a', outline: 'none', cursor: 'pointer' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <ImageUpload
              value={form.image}
              onChange={(url) => setForm(f => ({ ...f, image: url }))}
              label="Imagen del producto *"
            />

            <div>
              <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="uppercase block mb-2">Descripción</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descripción del producto…"
                rows={3}
                style={{ width: '100%', border: '1px solid rgba(0,0,0,0.12)', padding: '11px 14px', fontSize: '0.88rem', background: 'transparent', color: '#1a1a1a', outline: 'none', resize: 'vertical' }}
              />
            </div>

            {/* Variants section */}
            <div>
              <label style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '0.15em' }} className="uppercase block mb-1">
                Stock por variante (opcional)
              </label>
              <p style={{ color: '#aaa', fontSize: '0.72rem', marginBottom: '12px' }}>
                Si tu producto tiene variantes (tallas, medidas), agregalas aquí. Si no tiene variantes, dejá esta sección vacía.
              </p>
              <VariantBuilder
                variants={form.variants}
                onChange={v => setForm(f => ({ ...f, variants: v }))}
              />
            </div>

            {error && <p style={{ color: '#c0392b', fontSize: '0.8rem' }}>{error}</p>}
            {success && <p style={{ color: '#6B8F71', fontSize: '0.8rem' }}>{success}</p>}

            <button
              type="submit"
              style={{
                backgroundColor: '#1a1a1a',
                color: '#F5F0E8',
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                padding: '15px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '4px',
              }}
              className="uppercase flex items-center justify-center gap-2 hover:bg-black/80 transition-colors"
            >
              <Plus size={13} /> Publicar producto
            </button>
          </form>
        )}

        {/* ── Carousel manager ── */}
        {activeTab === 'carousel' && <CarouselManager />}
      </div>
    </div>
  );
}
