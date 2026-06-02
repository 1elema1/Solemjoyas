import { useState, useEffect } from 'react';
import { ShoppingBag, X, ArrowLeft } from 'lucide-react';
import { useStore, Product } from '../context/StoreContext';

const CATEGORIES = ['Anillos', 'Collares', 'Pulseras', 'Dijes', 'Aros', 'Abridores', 'Argollas'];

function VariantSelector({
  product,
  selected,
  onChange,
}: {
  product: Product;
  selected: string | undefined;
  onChange: (v: string) => void;
}) {
  const hasMultiple = product.variants.length > 1;
  const isSingle = product.variants.length === 1 && product.variants[0].label === 'Única';

  if (isSingle) return null;

  const getCategoryLabel = (cat: string) => {
    if (cat === 'Anillos') return 'Talla';
    if (cat === 'Pulseras' || cat === 'Collares') return 'Medida de cadena';
    if (cat === 'Argollas') return 'Diámetro';
    return 'Medida';
  };

  return (
    <div className="mb-5">
      <p style={{ color: '#888', fontSize: '0.68rem', letterSpacing: '0.15em' }} className="uppercase mb-3">
        {getCategoryLabel(product.category)}
      </p>
      <div className="flex flex-wrap gap-2">
        {product.variants.map(v => {
          const outOfStock = v.stock === 0;
          const isSelected = selected === v.label;
          return (
            <button
              key={v.label}
              onClick={() => !outOfStock && onChange(v.label)}
              disabled={outOfStock}
              title={outOfStock ? 'Sin stock' : `Stock: ${v.stock}`}
              style={{
                padding: '7px 14px',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                border: isSelected ? '1px solid #6B8F71' : '1px solid rgba(0,0,0,0.15)',
                backgroundColor: isSelected ? '#6B8F71' : 'transparent',
                color: outOfStock ? '#ccc' : isSelected ? 'white' : '#1a1a1a',
                cursor: outOfStock ? 'not-allowed' : 'pointer',
                position: 'relative',
                textDecoration: outOfStock ? 'line-through' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {v.label}
            </button>
          );
        })}
      </div>
      {!selected && hasMultiple && (
        <p style={{ color: '#c0392b', fontSize: '0.72rem', marginTop: '6px' }}>
          Seleccioná una medida para continuar
        </p>
      )}
    </div>
  );
}

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, setCartOpen, getAvailableStock } = useStore();
  const isSingle = product.variants.length === 1 && product.variants[0].label === 'Única';
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    isSingle ? 'Única' : undefined
  );
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canAdd = isSingle || Boolean(selectedVariant);

  const handleAdd = () => {
    if (!canAdd) return;
    setErrorMsg('');
    const result = addToCart(product.id, selectedVariant);
    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } else {
      setErrorMsg(result.message || 'Error al agregar al carrito');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleBuyNow = () => {
    if (!canAdd) return;
    setErrorMsg('');
    const result = addToCart(product.id, selectedVariant);
    if (result.success) {
      onClose();
      setCartOpen(true);
    } else {
      setErrorMsg(result.message || 'Error al agregar al carrito');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#F5F0E8',
          maxWidth: '760px',
          width: '100%',
          maxHeight: '92vh',
          overflow: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square overflow-hidden" style={{ minHeight: '300px' }}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col">
            <div className="flex justify-between items-start mb-5">
              <p style={{ color: '#6B8F71', fontSize: '0.65rem', letterSpacing: '0.2em' }} className="uppercase">
                {product.category}
              </p>
              <button onClick={onClose} style={{ color: '#888' }} className="hover:opacity-60 transition-opacity -mt-1">
                <X size={18} />
              </button>
            </div>

            <h2
              style={{
                fontFamily: '"Cormorant Garamond","Georgia",serif',
                fontSize: '1.9rem',
                color: '#1a1a1a',
                fontWeight: 300,
                lineHeight: 1.15,
              }}
              className="mb-3"
            >
              {product.name}
            </h2>

            <p style={{ color: '#6B8F71', fontSize: '1.25rem', letterSpacing: '0.03em' }} className="mb-5">
              ${product.price.toLocaleString('es-AR')}
            </p>

            <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.75 }} className="mb-6 flex-1">
              {product.description}
            </p>

            <VariantSelector
              product={product}
              selected={selectedVariant}
              onChange={setSelectedVariant}
            />

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px', marginBottom: '16px' }}>
              <p style={{ color: '#aaa', fontSize: '0.68rem', letterSpacing: '0.12em' }} className="uppercase">
                Material: Plata 925
              </p>
            </div>

            {errorMsg && (
              <div style={{
                backgroundColor: 'rgba(192,57,43,0.1)',
                border: '1px solid rgba(192,57,43,0.3)',
                padding: '10px 14px',
                marginBottom: '12px',
              }}>
                <p style={{ color: '#c0392b', fontSize: '0.75rem' }}>{errorMsg}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAdd}
                disabled={!canAdd}
                style={{
                  backgroundColor: !canAdd ? '#e0e0e0' : added ? '#6B8F71' : '#1a1a1a',
                  color: !canAdd ? '#aaa' : '#F5F0E8',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  padding: '14px',
                  cursor: !canAdd ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s',
                  border: 'none',
                }}
                className="uppercase flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                {added ? '✓ Agregado' : 'Agregar al carrito'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!canAdd}
                style={{
                  border: !canAdd ? '1px solid #e0e0e0' : '1px solid rgba(0,0,0,0.25)',
                  color: !canAdd ? '#ccc' : '#1a1a1a',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  padding: '14px',
                  backgroundColor: 'transparent',
                  cursor: !canAdd ? 'not-allowed' : 'pointer',
                }}
                className="uppercase hover:bg-black/5 transition-colors"
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [detail, setDetail] = useState(false);

  const isSingle = product.variants.length === 1 && product.variants[0].label === 'Única';
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSingle) {
      addToCart(product.id, 'Única');
    } else {
      setDetail(true);
    }
  };

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setDetail(true)}>
        <div
          className="relative overflow-hidden mb-4"
          style={{ aspectRatio: '3/4', borderRadius: '1px' }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Quick-add overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0)',
              transition: 'background 0.3s',
            }}
            className="group-hover:bg-black/10"
          />

          <button
            onClick={handleQuickAdd}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#1a1a1a',
              color: '#F5F0E8',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              padding: '10px 22px',
              whiteSpace: 'nowrap',
              border: 'none',
            }}
          >
            {isSingle ? 'Agregar al carrito' : 'Seleccionar medida'}
          </button>

          {totalStock <= 3 && totalStock > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(245,240,232,0.9)',
                padding: '3px 8px',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                color: '#c0392b',
              }}
              className="uppercase"
            >
              Últimas unidades
            </div>
          )}
        </div>

        <div>
          <p style={{ color: '#1a1a1a', fontSize: '0.88rem' }} className="mb-1">{product.name}</p>
          <p style={{ color: '#6B8F71', fontSize: '0.88rem' }}>${product.price.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {detail && <ProductDetailModal product={product} onClose={() => setDetail(false)} />}
    </>
  );
}

export function ProductGrid() {
  const { clientProducts, selectedCategory, setSelectedCategory, setCurrentView, searchQuery } = useStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);

  useEffect(() => { setActiveCategory(selectedCategory); }, [selectedCategory]);

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    setSelectedCategory(cat);
  };

  let filtered = activeCategory
    ? clientProducts.filter(p => p.category === activeCategory)
    : clientProducts;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  return (
    <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-6 py-14">

        <button
          onClick={() => setCurrentView('home')}
          style={{ color: '#888', fontSize: '0.68rem', letterSpacing: '0.15em' }}
          className="uppercase flex items-center gap-2 mb-10 hover:opacity-60 transition-opacity"
        >
          <ArrowLeft size={12} /> Inicio
        </button>

        <div className="mb-12">
          <p style={{ color: '#6B8F71', fontSize: '0.68rem', letterSpacing: '0.25em' }} className="uppercase mb-3">
            {searchQuery ? 'Búsqueda' : activeCategory ? 'Categoría' : 'Tienda'}
          </p>
          <h1
            style={{
              fontFamily: '"Cormorant Garamond","Georgia",serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: '#1a1a1a',
              fontWeight: 300,
            }}
          >
            {searchQuery ? `"${searchQuery}"` : activeCategory ?? 'Toda la colección'}
          </h1>
          {searchQuery && (
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '8px' }}>
              {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
            </p>
          )}
        </div>

        {/* Category tabs */}
        <div
          style={{ borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}
          className="flex overflow-x-auto gap-8 py-4 mb-12"
        >
          {[null, ...CATEGORIES].map(cat => (
            <button
              key={cat ?? 'all'}
              onClick={() => handleCategoryChange(cat)}
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                color: activeCategory === cat ? '#6B8F71' : '#888',
                background: 'none',
                border: 'none',
                borderBottom: activeCategory === cat ? '1px solid #6B8F71' : '1px solid transparent',
                paddingBottom: '2px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
              }}
              className="uppercase"
            >
              {cat ?? 'Todo'}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p style={{ color: '#6B8F71', fontSize: '2.5rem', marginBottom: '16px' }}>✦</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No hay productos disponibles en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '32px' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            Ubicados en Córdoba Capital · Envíos mediante Uber Envíos
          </p>
        </div>
      </div>
    </div>
  );
}
