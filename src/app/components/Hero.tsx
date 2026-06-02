import { useStore } from '../context/StoreContext';
import { ImageCarousel } from './ImageCarousel';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=900&q=80';

const CATEGORY_IMAGES: Record<string, string> = {
  Anillos: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=500&q=80',
  Collares: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80',
  Pulseras: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=80',
  Dijes: 'https://images.unsplash.com/photo-1511253819057-5408d4d70465?w=500&q=80',
  Aros: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
  Abridores: 'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=500&q=80',
  Argollas: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=500&q=80',
};

const CATEGORIES = ['Anillos', 'Collares', 'Pulseras', 'Dijes', 'Aros', 'Abridores', 'Argollas'];

export function Hero() {
  const { setCurrentView, setSelectedCategory, carouselImages } = useStore();

  const goCategory = (cat: string) => { setSelectedCategory(cat); setCurrentView('products'); };
  const goAll = () => { setSelectedCategory(null); setCurrentView('products'); };

  return (
    <div style={{ backgroundColor: '#F5F0E8' }}>

      {/* ── Hero 50/50 ── */}
      <section style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="grid md:grid-cols-2" style={{ minHeight: '82vh' }}>

          {/* Left — text */}
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
            <p
              style={{ color: '#6B8F71', fontSize: '0.68rem', letterSpacing: '0.28em' }}
              className="uppercase mb-8 tracking-widest"
            >
              Plata 925
            </p>

            <h1
              style={{
                fontFamily: '"Cormorant Garamond", "Georgia", serif',
                fontSize: 'clamp(2.8rem, 5.5vw, 5.2rem)',
                lineHeight: '1.05',
                color: '#1a1a1a',
                fontWeight: 300,
                letterSpacing: '-0.01em',
              }}
              className="mb-8"
            >
              Joyas que<br />
              <em style={{ fontStyle: 'italic', color: '#6B8F71', fontWeight: 400 }}>brillan</em><br />
              con calma.
            </h1>

            <p
              style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.8', maxWidth: '360px' }}
              className="mb-12"
            >
              Piezas únicas en plata 925, diseñadas y creadas a mano en Córdoba. Sutiles, atemporales, hechas para acompañarte.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={goAll}
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#F5F0E8',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  padding: '15px 32px',
                  border: 'none',
                }}
                className="uppercase hover:bg-black/80 transition-colors"
              >
                Explorar tienda →
              </button>
              <button
                onClick={() => goCategory('Collares')}
                style={{
                  border: '1px solid rgba(0,0,0,0.25)',
                  color: '#1a1a1a',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  padding: '15px 32px',
                  backgroundColor: 'transparent',
                }}
                className="uppercase hover:bg-black/5 transition-colors"
              >
                Ver collares
              </button>
            </div>
          </div>

          {/* Right — image, exactly 50% */}
          <div className="relative hidden md:block" style={{ overflow: 'hidden' }}>
            <img
              src={HERO_IMAGE}
              alt="Joya SOLEM"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            {/* Subtle tag */}
            <div
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                backgroundColor: 'rgba(245,240,232,0.92)',
                padding: '14px 20px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p style={{ color: '#6B8F71', fontSize: '0.6rem', letterSpacing: '0.22em' }} className="uppercase mb-1">Nueva colección</p>
              <p style={{ color: '#1a1a1a', fontSize: '0.72rem', letterSpacing: '0.12em' }} className="uppercase">Joyas para siempre</p>
            </div>
          </div>

          {/* Mobile image */}
          <div className="md:hidden h-72 overflow-hidden">
            <img src={HERO_IMAGE} alt="Joya SOLEM" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── Categories grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p style={{ color: '#6B8F71', fontSize: '0.68rem', letterSpacing: '0.25em' }} className="uppercase mb-4">
            Colecciones
          </p>
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", "Georgia", serif',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: '#1a1a1a',
              fontWeight: 300,
            }}
          >
            Explorá nuestras categorías
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => goCategory(cat)}
              className="group relative overflow-hidden"
              style={{ aspectRatio: '1', borderRadius: '1px' }}
            >
              <img
                src={CATEGORY_IMAGES[cat]}
                alt={cat}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)',
                  transition: 'opacity 0.3s',
                }}
              />
              <p
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  color: 'white',
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  fontWeight: 500,
                }}
                className="uppercase"
              >
                {cat}
              </p>
            </button>
          ))}

          <button
            onClick={goAll}
            className="group relative overflow-hidden flex items-center justify-center"
            style={{ aspectRatio: '1', backgroundColor: '#1a1a1a', borderRadius: '1px' }}
          >
            <div className="text-center">
              <div style={{ color: '#6B8F71', fontSize: '2.2rem', marginBottom: '10px', lineHeight: 1 }}>✦</div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', letterSpacing: '0.2em' }} className="uppercase">
                Ver todo
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* ── Carousel section ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <p style={{ color: '#6B8F71', fontSize: '0.68rem', letterSpacing: '0.25em' }} className="uppercase mb-2">
            Inspiración
          </p>
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", "Georgia", serif',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
              color: '#1a1a1a',
              fontWeight: 300,
            }}
          >
            Descubrí nuestras piezas
          </h2>
        </div>
        <ImageCarousel images={carouselImages} />
      </section>

      {/* ── Footer strip ── */}
      <footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            <div>
              <p style={{ color: '#6B8F71', fontSize: '0.65rem', letterSpacing: '0.2em' }} className="uppercase mb-2">Ubicación</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Ubicados en<br />Córdoba Capital
              </p>
            </div>
            <div>
              <p style={{ color: '#6B8F71', fontSize: '0.65rem', letterSpacing: '0.2em' }} className="uppercase mb-2">Envíos</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Realizamos envíos<br />mediante Uber Envíos
              </p>
            </div>
            <div>
              <p style={{ color: '#6B8F71', fontSize: '0.65rem', letterSpacing: '0.2em' }} className="uppercase mb-2">Material</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Plata 925<br />certificada y garantizada
              </p>
            </div>
            <div>
              <p style={{ color: '#6B8F71', fontSize: '0.65rem', letterSpacing: '0.2em' }} className="uppercase mb-2">Pedidos</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Coordinados por WhatsApp<br />Sin pagos en línea
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '32px', paddingTop: '24px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', letterSpacing: '0.12em' }}>
              © 2025 SOLEM · Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
