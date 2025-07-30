import './globals.css';

import Image from 'next/image';
import Link from 'next/link';
import BuscadorProductos from '@/components/BuscadorProductos';
import PresupuestoChart from '@/components/PresupuestoChart';
import FechaActual from '@/components/FechaActual';
import ActualizacionesList from '@/components/ActualizacionesList';
import Bienvenida from '@/components/Bienvenida';



export default function HomePage() {
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
