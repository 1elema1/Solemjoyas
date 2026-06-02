import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Variant {
  label: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  variants: Variant[];
  active: boolean;
}

export interface CarouselSettings {
  images: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: string;
}

export interface User {
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => void;
  toggleActive: (id: string) => void;
  clientProducts: Product[]; // only active + has stock
  cart: CartItem[];
  addToCart: (productId: string, variant?: string) => { success: boolean; message?: string };
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, qty: number, variant?: string) => { success: boolean; message?: string };
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
  currentView: 'home' | 'products' | 'admin';
  setCurrentView: (v: 'home' | 'products' | 'admin') => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  generateWhatsAppLink: () => string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  carouselImages: string[];
  updateCarouselImages: (images: string[]) => void;
  getAvailableStock: (productId: string, variant?: string) => number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const ADMIN_EMAIL = 'admin@solem.com';
const ADMIN_PASSWORD = 'solem2025';

const makeVariants = (labels: string[], stock = 5): Variant[] =>
  labels.map(label => ({ label, stock }));

const RING_SIZES = ['12', '13', '14', '15', '16', '17', '18', '19'];
const CHAIN_CM = ['40cm', '42cm', '45cm', '50cm'];
const BRACELET_CM = ['16cm', '17cm', '18cm', '19cm', '20cm'];
const HOOP_MM = ['20mm', '25mm', '30mm', '40mm'];
const SINGLE = [{ label: 'Única', stock: 10 }];

const INITIAL_PRODUCTS: Product[] = [
  // Anillos
  { id: '1', name: 'Anillo Solitario Clásico', price: 4500, category: 'Anillos', image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=600', description: 'Elegante anillo solitario en plata 925 con piedra central. Perfecto para cada ocasión.', variants: makeVariants(RING_SIZES), active: true },
  { id: '2', name: 'Anillo Banda Minimalista', price: 3200, category: 'Anillos', image: 'https://images.unsplash.com/photo-1583937443566-6fe1a1c6e400?w=600', description: 'Anillo banda lisa en plata 925 de corte contemporáneo.', variants: makeVariants(RING_SIZES), active: true },
  { id: '3', name: 'Anillo Vintage con Piedra', price: 5200, category: 'Anillos', image: 'https://images.unsplash.com/photo-1613945407943-59cd755fd69e?w=600', description: 'Diseño vintage con engaste de piedra semipreciosa en plata 925.', variants: makeVariants(RING_SIZES), active: true },
  // Collares
  { id: '4', name: 'Collar Corazón Delicado', price: 5800, category: 'Collares', image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600', description: 'Delicado collar con colgante de corazón en plata 925.', variants: makeVariants(CHAIN_CM), active: true },
  { id: '5', name: 'Collar Cadena Eslabón', price: 4200, category: 'Collares', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600', description: 'Cadena de eslabón clásica en plata 925.', variants: makeVariants(CHAIN_CM), active: true },
  { id: '6', name: 'Collar Dije Luna', price: 4800, category: 'Collares', image: 'https://images.unsplash.com/photo-1588444968576-f8fe92ce56fd?w=600', description: 'Collar con dije de luna en plata 925, símbolo de feminidad.', variants: makeVariants(CHAIN_CM), active: true },
  // Pulseras
  { id: '7', name: 'Pulsera Corazones', price: 3800, category: 'Pulseras', image: 'https://images.unsplash.com/photo-1676291055501-286c48bb186f?w=600', description: 'Pulsera con dijes de corazón en plata 925.', variants: makeVariants(BRACELET_CM), active: true },
  { id: '8', name: 'Pulsera Eslabón Clásica', price: 4500, category: 'Pulseras', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600', description: 'Pulsera de eslabón en plata 925. Cierre langosta.', variants: makeVariants(BRACELET_CM), active: true },
  // Dijes
  { id: '9', name: 'Dije Cruz Calada', price: 1800, category: 'Dijes', image: 'https://images.unsplash.com/photo-1511253819057-5408d4d70465?w=600', description: 'Dije de cruz calada en plata 925. Incluye argolla.', variants: SINGLE, active: true },
  { id: '10', name: 'Dije Estrella', price: 2200, category: 'Dijes', image: 'https://images.unsplash.com/photo-1679156271420-e6c596e9c10a?w=600', description: 'Dije de estrella de 6 puntas en plata 925.', variants: SINGLE, active: true },
  // Aros
  { id: '11', name: 'Aros Piedra Azul', price: 2800, category: 'Aros', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', description: 'Aros con piedra azul en plata 925. Cierre mariposa.', variants: SINGLE, active: true },
  { id: '12', name: 'Aros Topo Redondo', price: 1800, category: 'Aros', image: 'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=600', description: 'Aros topo redondo en plata 925. Diseño clásico y versátil.', variants: SINGLE, active: true },
  // Abridores
  { id: '13', name: 'Abridor Básico Liso', price: 1200, category: 'Abridores', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', description: 'Abridor básico liso en plata 925. Ideal para primeras perforaciones.', variants: SINGLE, active: true },
  { id: '14', name: 'Abridor con Bolita', price: 1500, category: 'Abridores', image: 'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=600', description: 'Abridor con terminación en bolita en plata 925.', variants: SINGLE, active: true },
  // Argollas
  { id: '15', name: 'Argolla Mediana', price: 2500, category: 'Argollas', image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600', description: 'Argolla mediana en plata 925.', variants: makeVariants(HOOP_MM), active: true },
  { id: '16', name: 'Argolla Grande', price: 3200, category: 'Argollas', image: 'https://images.unsplash.com/photo-1676120963306-8969fa6a810e?w=600', description: 'Argolla grande en plata 925. Muy versátil.', variants: makeVariants(HOOP_MM), active: true },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function hasStock(product: Product): boolean {
  return product.variants.some(v => v.stock > 0);
}

const DEFAULT_CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = loadFromStorage<Product[]>('solem_products_v2', []);
    return stored.length > 0 ? stored : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('solem_cart_v2', []));
  const [user, setUser] = useState<User | null>(() => loadFromStorage('solem_user', null));
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselImages, setCarouselImages] = useState<string[]>(() =>
    loadFromStorage('solem_carousel', DEFAULT_CAROUSEL_IMAGES)
  );

  useEffect(() => { localStorage.setItem('solem_products_v2', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('solem_cart_v2', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (user) localStorage.setItem('solem_user', JSON.stringify(user));
    else localStorage.removeItem('solem_user');
  }, [user]);
  useEffect(() => { localStorage.setItem('solem_carousel', JSON.stringify(carouselImages)); }, [carouselImages]);

  const clientProducts = products.filter(p => p.active && hasStock(p));

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: Date.now().toString() }]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const toggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const getAvailableStock = (productId: string, variant?: string): number => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    if (variant) {
      const v = product.variants.find(vr => vr.label === variant);
      return v?.stock ?? 0;
    }

    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  const addToCart = (productId: string, variant?: string): { success: boolean; message?: string } => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Producto no encontrado' };

    const availableStock = getAvailableStock(productId, variant);
    const currentCartItem = cart.find(i => i.productId === productId && i.variant === variant);
    const currentQuantity = currentCartItem?.quantity ?? 0;

    if (currentQuantity >= availableStock) {
      return {
        success: false,
        message: `No hay más stock disponible de este producto${variant && variant !== 'Única' ? ` (${variant})` : ''}`
      };
    }

    setCart(prev => {
      const existing = prev.find(i => i.productId === productId && i.variant === variant);
      if (existing) {
        return prev.map(i =>
          i.productId === productId && i.variant === variant
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { productId, quantity: 1, variant }];
    });

    return { success: true };
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart(prev => prev.filter(i => !(i.productId === productId && i.variant === variant)));
  };

  const updateQuantity = (productId: string, qty: number, variant?: string): { success: boolean; message?: string } => {
    if (qty <= 0) {
      removeFromCart(productId, variant);
      return { success: true };
    }

    const availableStock = getAvailableStock(productId, variant);

    if (qty > availableStock) {
      return {
        success: false,
        message: `Solo hay ${availableStock} unidades disponibles`
      };
    }

    setCart(prev => prev.map(i =>
      i.productId === productId && i.variant === variant
        ? { ...i, quantity: qty }
        : i
    ));

    return { success: true };
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const login = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({ name: 'Administrador', email, role: 'admin' });
      return { success: true, message: 'Bienvenido' };
    }
    const customers: { name: string; email: string; password: string }[] = loadFromStorage('solem_customers', []);
    const found = customers.find(c => c.email === email && c.password === password);
    if (found) {
      setUser({ name: found.name, email: found.email, role: 'customer' });
      return { success: true, message: `Bienvenida, ${found.name}` };
    }
    return { success: false, message: 'Email o contraseña incorrectos' };
  };

  const register = (name: string, email: string, password: string) => {
    const customers: { name: string; email: string; password: string }[] = loadFromStorage('solem_customers', []);
    if (customers.find(c => c.email === email)) return { success: false, message: 'Ya existe una cuenta con ese email' };
    localStorage.setItem('solem_customers', JSON.stringify([...customers, { name, email, password }]));
    setUser({ name, email, role: 'customer' });
    return { success: true, message: `Bienvenida, ${name}` };
  };

  const logout = () => { setUser(null); setCurrentView('home'); };

  const generateWhatsAppLink = () => {
    const number = '3516854262';
    const lines = cart.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (!p) return '';
      const variantText = item.variant && item.variant !== 'Única' ? ` (${item.variant})` : '';
      return `• ${item.quantity}x ${p.name}${variantText} - $${(p.price * item.quantity).toLocaleString('es-AR')}`;
    }).filter(Boolean).join('\n');

    const message = `¡Hola SOLEM! Quiero hacer el siguiente pedido 🛍️\n\n*Pedido - Plata 925:*\n\n${lines}\n\n*TOTAL: $${cartTotal.toLocaleString('es-AR')}*\n\nPor favor confirmame disponibilidad. ¡Muchas gracias! ✨`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const updateCarouselImages = (images: string[]) => {
    setCarouselImages(images);
  };

  return (
    <StoreContext.Provider value={{
      products, addProduct, deleteProduct, updateProduct, toggleActive, clientProducts,
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
      cartOpen, setCartOpen, loginOpen, setLoginOpen,
      currentView, setCurrentView, selectedCategory, setSelectedCategory,
      user, login, register, logout, generateWhatsAppLink,
      searchQuery, setSearchQuery, carouselImages, updateCarouselImages, getAvailableStock,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
