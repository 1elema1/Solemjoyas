import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

export interface Variant {
  label: string;
  stock: number;
}

export interface ColorVariant {
  color: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  variants?: Variant[];
  generalStock?: number;
  active: boolean;
  colors?: ColorVariant[];
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
  email: string;
  role: 'admin';
}

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  clientProducts: Product[];
  cart: CartItem[];
  addToCart: (productId: string, variant?: string) => { success: boolean; message?: string };
  removeFromCart: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, qty: number, variant?: string) => { success: boolean; message?: string };
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  currentView: 'home' | 'products' | 'admin';
  setCurrentView: (v: 'home' | 'products' | 'admin') => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
  user: User | null;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  adminLogout: () => Promise<void>;
  generateWhatsAppLink: () => string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  carouselImages: string[];
  updateCarouselImages: (images: string[]) => void;
  getAvailableStock: (productId: string, variant?: string) => number;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function hasStock(product: Product): boolean {
  if (product.variants && product.variants.length > 0) {
    return product.variants.some(v => v.stock > 0);
  }
  return (product.generalStock ?? 0) > 0;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

const DEFAULT_CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('solem_cart_v2', []));
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselImages, setCarouselImages] = useState<string[]>(() =>
    loadFromStorage('solem_carousel', DEFAULT_CAROUSEL_IMAGES)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email!, role: 'admin' });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time sync from Firestore — no local mock fallback
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData: Product[] = snapshot.docs.map(
          (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Product)
        );
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error al cargar productos desde Firestore:', error);
        setProducts([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => { localStorage.setItem('solem_cart_v2', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('solem_carousel', JSON.stringify(carouselImages)); }, [carouselImages]);

  const clientProducts = products.filter(p => p.active && hasStock(p));

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), product);
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    try {
      await updateDoc(doc(db, 'products', id), updates as any);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  };

  const toggleActive = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      await updateProduct(id, { active: !product.active });
    }
  };

  const getAvailableStock = (productId: string, variant?: string): number => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    if (product.variants && product.variants.length > 0) {
      if (variant) {
        const v = product.variants.find(vr => vr.label === variant);
        return v?.stock ?? 0;
      }
      return product.variants.reduce((sum, v) => sum + v.stock, 0);
    }

    return product.generalStock ?? 0;
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
        message: `No hay más stock disponible de este producto${variant && variant !== 'Única' ? ` (${variant})` : ''}`,
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
      return { success: false, message: `Solo hay ${availableStock} unidades disponibles` };
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

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true, message: 'Bienvenido, Administrador' };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, message: 'Email o contraseña incorrectos' };
    }
  };

  const adminLogout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentView('home');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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
      cartOpen, setCartOpen,
      currentView, setCurrentView, selectedCategory, setSelectedCategory,
      user, adminLogin, adminLogout, generateWhatsAppLink,
      searchQuery, setSearchQuery, carouselImages, updateCarouselImages, getAvailableStock,
      loading,
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
