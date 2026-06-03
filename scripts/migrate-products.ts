/**
 * Script para migrar productos iniciales a Firestore
 *
 * Uso:
 * 1. Descargar Service Account Key desde Firebase Console
 * 2. Guardar como serviceAccountKey.json en la raíz
 * 3. npm install firebase-admin
 * 4. npx tsx scripts/migrate-products.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Cargar credenciales del service account
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

interface Variant {
  label: string;
  stock: number;
}

interface Product {
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  variants: Variant[];
  active: boolean;
}

const makeVariants = (labels: string[], stock = 5): Variant[] =>
  labels.map(label => ({ label, stock }));

const RING_SIZES = ['12', '13', '14', '15', '16', '17', '18', '19'];
const CHAIN_CM = ['40cm', '42cm', '45cm', '50cm'];
const BRACELET_CM = ['16cm', '17cm', '18cm', '19cm', '20cm'];
const HOOP_MM = ['20mm', '25mm', '30mm', '40mm'];
const SINGLE: Variant[] = [{ label: 'Única', stock: 10 }];

const INITIAL_PRODUCTS: Product[] = [
  // Anillos
  { name: 'Anillo Solitario Clásico', price: 4500, category: 'Anillos', image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=600', description: 'Elegante anillo solitario en plata 925 con piedra central. Perfecto para cada ocasión.', variants: makeVariants(RING_SIZES), active: true },
  { name: 'Anillo Banda Minimalista', price: 3200, category: 'Anillos', image: 'https://images.unsplash.com/photo-1583937443566-6fe1a1c6e400?w=600', description: 'Anillo banda lisa en plata 925 de corte contemporáneo.', variants: makeVariants(RING_SIZES), active: true },
  { name: 'Anillo Vintage con Piedra', price: 5200, category: 'Anillos', image: 'https://images.unsplash.com/photo-1613945407943-59cd755fd69e?w=600', description: 'Diseño vintage con engaste de piedra semipreciosa en plata 925.', variants: makeVariants(RING_SIZES), active: true },

  // Collares
  { name: 'Collar Corazón Delicado', price: 5800, category: 'Collares', image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600', description: 'Delicado collar con colgante de corazón en plata 925.', variants: makeVariants(CHAIN_CM), active: true },
  { name: 'Collar Cadena Eslabón', price: 4200, category: 'Collares', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600', description: 'Cadena de eslabón clásica en plata 925.', variants: makeVariants(CHAIN_CM), active: true },
  { name: 'Collar Dije Luna', price: 4800, category: 'Collares', image: 'https://images.unsplash.com/photo-1588444968576-f8fe92ce56fd?w=600', description: 'Collar con dije de luna en plata 925, símbolo de feminidad.', variants: makeVariants(CHAIN_CM), active: true },

  // Pulseras
  { name: 'Pulsera Corazones', price: 3800, category: 'Pulseras', image: 'https://images.unsplash.com/photo-1676291055501-286c48bb186f?w=600', description: 'Pulsera con dijes de corazón en plata 925.', variants: makeVariants(BRACELET_CM), active: true },
  { name: 'Pulsera Eslabón Clásica', price: 4500, category: 'Pulseras', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600', description: 'Pulsera de eslabón en plata 925. Cierre langosta.', variants: makeVariants(BRACELET_CM), active: true },

  // Dijes
  { name: 'Dije Cruz Calada', price: 1800, category: 'Dijes', image: 'https://images.unsplash.com/photo-1511253819057-5408d4d70465?w=600', description: 'Dije de cruz calada en plata 925. Incluye argolla.', variants: SINGLE, active: true },
  { name: 'Dije Estrella', price: 2200, category: 'Dijes', image: 'https://images.unsplash.com/photo-1679156271420-e6c596e9c10a?w=600', description: 'Dije de estrella de 6 puntas en plata 925.', variants: SINGLE, active: true },

  // Aros
  { name: 'Aros Piedra Azul', price: 2800, category: 'Aros', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', description: 'Aros con piedra azul en plata 925. Cierre mariposa.', variants: SINGLE, active: true },
  { name: 'Aros Topo Redondo', price: 1800, category: 'Aros', image: 'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=600', description: 'Aros topo redondo en plata 925. Diseño clásico y versátil.', variants: SINGLE, active: true },

  // Abridores
  { name: 'Abridor Básico Liso', price: 1200, category: 'Abridores', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', description: 'Abridor básico liso en plata 925. Ideal para primeras perforaciones.', variants: SINGLE, active: true },
  { name: 'Abridor con Bolita', price: 1500, category: 'Abridores', image: 'https://images.unsplash.com/photo-1693212793204-bcea856c75fe?w=600', description: 'Abridor con terminación en bolita en plata 925.', variants: SINGLE, active: true },

  // Argollas
  { name: 'Argolla Mediana', price: 2500, category: 'Argollas', image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600', description: 'Argolla mediana en plata 925.', variants: makeVariants(HOOP_MM), active: true },
  { name: 'Argolla Grande', price: 3200, category: 'Argollas', image: 'https://images.unsplash.com/photo-1676120963306-8969fa6a810e?w=600', description: 'Argolla grande en plata 925. Muy versátil.', variants: makeVariants(HOOP_MM), active: true },
];

async function migrateProducts() {
  console.log('🚀 Iniciando migración de productos...');

  const productsRef = db.collection('products');

  let count = 0;
  for (const product of INITIAL_PRODUCTS) {
    try {
      await productsRef.add(product);
      count++;
      console.log(`✅ Agregado: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error al agregar ${product.name}:`, error);
    }
  }

  console.log(`\n✨ Migración completada: ${count}/${INITIAL_PRODUCTS.length} productos agregados`);
  process.exit(0);
}

migrateProducts().catch(error => {
  console.error('❌ Error en la migración:', error);
  process.exit(1);
});
