'use client';

import Image from 'next/image';
import Link from 'next/link';
import BuscadorProductos from '@/components/BuscadorProductos';
import PresupuestoChart from '@/components/PresupuestoChart';
import FechaActual from '@/components/FechaActual';
import ActualizacionesList from '@/components/ActualizacionesList';
import Bienvenida from '@/components/Bienvenida';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        setCheckingAuth(false);
        document.body.classList.add('auth-ready');
      }
    });

    return () => {
      unsubscribe();
      document.body.classList.remove('auth-ready');
    };
  }, [router]);

  if (checkingAuth) {
    return null; // No mostramos nada hasta que se confirme
  }

  return (
    <main>
      {/* HEADER */}
      <header className="main-header">
        <Image src="/images/prix_img.jpeg" alt="Prix" width={300} height={80} priority />
        <nav className="main-nav">
          <Link href="/">Presupuestador</Link>
          <Link href="/config">Configuración</Link>
        </nav>
      </header>
      
      <div className="wrapper">
        {/* WELCOME */}
        <div className="welcome-container">
          <Bienvenida />
          <FechaActual />
        </div>

        {/* BUSCADOR */}
        <BuscadorProductos />
      </div>

      {/* METRICAS */}
      <div className="metrics-container">
        <div className="actualizaciones">
          <h2>Últimas Actualizaciones</h2>
          <ActualizacionesList />
        </div>

      <div className="presupuestos">
        <Link href="/presupuestos" style={{ cursor: 'pointer',textDecoration: 'none', color: 'black' }}>
            <h2 >Presupuestos Hechos</h2>
        </Link>
        <div className="graph">
          <PresupuestoChart />
        </div>
      </div>
      </div>
    </main>
  );
}
