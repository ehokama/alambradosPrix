'use client';

import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Presupuesto } from '@/types/productos';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { generarTipoFacturaPDF} from '@/components/DescargarTipoFacturaPDF';
import { generarInformativoPDF} from '@/components/DescargarInformativoPDF';

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
        docs.push({ ...(docSnap.data() as Presupuesto), nro: docSnap.id });

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
            <div id="presupuestos-lista">
  <h2>Lista de presupuestos</h2>
  {cargando ? (
    <p>Cargando...</p>
  ) : presupuestos.length === 0 ? (
    <p>No hay presupuestos para este período.</p>
  ) : (
    <div id="lista">
      {presupuestos.map((p) => (
        <div key={p.nro} className="producto-seleccionado">
          <div style={{ flex: 1 }}>
            <strong>N°PRESUPUESTO:</strong> {p.nro}<br />
            <strong>Cliente:</strong> {p.nombreCliente} <br />
            <strong>Ubicación:</strong> {p.ubicacionCliente} <br />
            <strong>Obra:</strong> {p.obraCliente}<br />

            <strong>Fecha:</strong> {p.fecha} <br />
            <strong>Autor:</strong> {p.autor}
                      </div>
          
            <button className="boton-descargar" style={{ marginLeft: '20px', marginTop:'10px' }} onClick={() => generarTipoFacturaPDF(p.nombreCliente, p.productos, p.ubicacionCliente, p.obraCliente, false)}>
              Descargar PDF Tipo Factura
            </button>
                      
            <button className="boton-descargar" style={{ marginLeft: '20px', marginTop:'10px' }} onClick={() => generarInformativoPDF(p.nombreCliente, p.productos, p.ubicacionCliente, p.obraCliente, false)}>
              Descargar PDF Informativo
            </button>
        </div>
      ))}
    </div>
  )}
</div>

          </div>
        </div>
      </div>
    </>
  );
}
