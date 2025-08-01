'use client';

import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { collection, query, where, getDocs } from 'firebase/firestore';

type Presupuesto = {
  id: string;
  cliente?: string;
  total?: number;
  fecha?: string;
};

export default function PresupuestosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [anio, setAnio] = useState(() => new Date().getFullYear().toString());
  const [mes, setMes] = useState(() => (new Date().getMonth() + 1).toString().padStart(2, '0'));

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [cargando, setCargando] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (!usr) {
        router.replace('/login');
      } else {
        setUser(usr);
        setCheckingAuth(false);
        document.body.classList.add('auth-ready');
      }
    });
    return () => {
      unsubscribe();
      document.body.classList.remove('auth-ready');
    };
  }, [router]);

  // Cargar presupuestos cuando cambien anio, mes o user
  useEffect(() => {
    if (user && anio && mes) {
      cargarPresupuestos(anio, mes);
    }
  }, [anio, mes, user]);

  async function cargarPresupuestos(anio: string, mes: string) {
    setCargando(true);
    try {
      const inicio = `${anio}-${mes.padStart(2, '0')}-01`;
      // Calcular el mes siguiente
      let anioFin = parseInt(anio);
      let mesFin = parseInt(mes) + 1;
      if (mesFin > 12) {
        mesFin = 1;
        anioFin++;
      }
      const fin = `${anioFin}-${mesFin.toString().padStart(2, '0')}-01`;

      const q = query(
        collection(db, 'presupuestos'),
        where('fecha', '>=', inicio),
        where('fecha', '<', fin)
      );

      const querySnapshot = await getDocs(q);
      const docs: Presupuesto[] = [];
      querySnapshot.forEach((docSnap) => {
        docs.push({ ...(docSnap.data() as Presupuesto), id: docSnap.id });

      });

      setPresupuestos(docs);
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
      setPresupuestos([]);
    }
    setCargando(false);
  }

  if (checkingAuth) return null;

  return (
    <>
      {/* HEADER */}
      <header className="main-header">
        <Image src="/images/prix_img.jpeg" alt="Prix Image" width={200} height={100} />
        <nav className="main-nav">
          <Link href="/dashboard">Presupuestador</Link>
          <Link href="/config">Configuración</Link>
        </nav>
      </header>

      {/* MAIN */}
      <div className="wrapper">
        <h1 className="title-text">Presupuestos</h1>

        <div className="config-container">
          <h2>Seleccionar año y mes</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="number"
              min={2000}
              max={2100}
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              placeholder="Año"
              style={{ width: '100px' }}
              className="cantidad-input"
            />
            <input
              type="number"
              min={1}
              max={12}
              value={parseInt(mes, 10)}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setMes('');
                  return;
                }
                const num = Math.min(Math.max(parseInt(val), 1), 12);
                setMes(num.toString().padStart(2, '0'));
              }}
              placeholder="Mes"
              style={{ width: '80px' }}
              className="cantidad-input"
            />
          </div>

          <div id="presupuestos-lista">
            <h2>Lista de presupuestos:</h2>
            {cargando ? (
              <p>Cargando...</p>
            ) : presupuestos.length === 0 ? (
              <p>No hay presupuestos para este período.</p>
            ) : (
              <ul>
                {presupuestos.map((p) => (
                  <li key={p.id} style={{ marginBottom: '0.5rem' }}>
                    <strong>Cliente:</strong> {p.cliente ?? 'N/A'} —{' '}
                    <strong>Total:</strong>{' '}
                    {p.total?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) ?? '-'} —{' '}
                    <strong>Fecha:</strong> {p.fecha ?? '-'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
