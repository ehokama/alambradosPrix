'use client';

import './globals.css';

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
        router.replace('/login'); // redirige si NO hay usuario
      } else {
        setCheckingAuth(false); // si hay usuario, deja mostrar la página
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return <p>Verificando autenticación...</p>;
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
          <h2>Presupuestos Hechos</h2>
          <div className="graph">
            <PresupuestoChart />
          </div>
        </div>
      </div>
    </main>
  );
}
