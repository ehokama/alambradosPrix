'use client';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from "@/firebase/config";
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ConfigPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // o a la ruta de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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

      {/* MAIN CONTENT */}
      <div className="wrapper">
        <div className="title-container">
          <h1 className="title-text">Configuración</h1>
        </div>

        <div className="config-container">
          <h1 className="categoria-title">Seleccionar categoría de productos</h1>
          <select id="categoria">
            <option value="postes">Postes</option>
            <option value="tejidos">Tejidos</option>
            <option value="puertas">Puertas</option>
            <option value="portones">Portones</option>
            <option value="accesorios">
              Otros (Ganchos, Torniquetes, Planchuelas, Alambres, Concertinas, Resistencias, etc)
            </option>
          </select>

          <div id="productos">
            <h2>Lista de productos:</h2>
            <div id="lista">
              <div className="producto">Producto1</div>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL BODY */}
      <div className="final-body">
        <button onClick={handleLogout} className="boton-cerrarSesion">
          Cerrar sesión
        </button>
      </div>
    </>
  );
}
