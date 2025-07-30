'use client';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from "@/firebase/config";
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { obtenerDocumentosPorCampo  } from '@/app/utils/firestoreUtils'; 
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { obtenerFechaFormateada } from '../utils/fecha';
import { autoWidth } from '../utils/autowidth'; 

export default function ConfigPage() {
  interface Producto {
    nombre: string;
  }

  const router = useRouter();
  const [categoria, setCategoria] = useState<string>('Poste');
  const [productos, setProductos] = useState<any[]>([]);
  const [productosAbiertos, setProductosAbiertos] = useState<Set<string>>(new Set());
  const [camposEditando, setCamposEditando] = useState<Record<string, string | null>>({});
  const [valoresTemporales, setValoresTemporales] = useState<Record<string, string>>({});

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const cargarProductos = async (categoria: string) => {
    const docs = await obtenerDocumentosPorCampo<Producto>('productos', 'tipo', categoria);
    const docsOrdenados = docs.sort((a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? ''));
    setProductos(docsOrdenados);
  };

  const handleCategoriaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaCategoria = e.target.value;
    setCategoria(nuevaCategoria);
    await cargarProductos(nuevaCategoria);
  };

   const toggleProducto = (id: string) => {
    setProductosAbiertos((prev) => {
      const nuevo = new Set(prev);
      nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id);
      return nuevo;
    });
  };

  const editarCampo = (prodId: string, campo: string, valorActual: string) => {
    setCamposEditando((prev) => ({ ...prev, [`${prodId}-${campo}`]: campo }));
    setValoresTemporales((prev) => ({ ...prev, [`${prodId}-${campo}`]: valorActual }));
  };

const guardarCampo = async (id: string, campo: string) => {
  const clave = `${id}-${campo}`;
  const nuevoValor = valoresTemporales[clave];

  if (nuevoValor === undefined || nuevoValor.trim() === '') return;

  try {
    const productoRef = doc(db, 'productos', id);
    await updateDoc(productoRef, {
      [campo]: nuevoValor,
      ultimaModificacion: obtenerFechaFormateada(),
    });

    // actualiza localmente
    setProductos((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, [campo]: nuevoValor, ultimaModificacion: new Date().toISOString() } : prod
      )
    );

    // cleanin'
    setCamposEditando((prev) => {
      const copia = { ...prev };
      delete copia[clave];
      return copia;
    });
    setValoresTemporales((prev) => {
      const copia = { ...prev };
      delete copia[clave];
      return copia;
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
};

  useEffect(() => {
    (async () => {
      await cargarProductos(categoria);
    })();
  }, []);

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
          <select id="categoria" value={categoria} onChange={handleCategoriaChange}> 
            <option value="Poste">Postes</option>
            <option value="Tejido">Tejidos</option>
            <option value="Puerta">Puertas</option>
            <option value="Porton">Portones</option>
            <option value="Accesorio">
              Otros (Ganchos, Torniquetes, Planchuelas, Alambres, Concertinas, Resistencias, etc)
            </option>
          </select>


        <div id="productos">
          <h2>Lista de productos:</h2>
          <div id="lista">
            {productos.length === 0 ? (
                <p>No hay productos en esta categoría.</p>
              ) : (
                productos.map((prod) => (
                  <div key={prod.id} className="producto">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{prod.nombre}</strong>
                      <button onClick={() => toggleProducto(prod.id)} className="edit-button"> 
                        {productosAbiertos.has(prod.id) ? 'Ocultar' : 'Editar'}
                      </button>
                    </div>

                    {productosAbiertos.has(prod.id) && (
                      <div className="detalles-producto">
                        {Object.entries(prod).map(([campo, valor]) => {
                          if (['id'].includes(campo)) return null;
      const clave = `${prod.id}-${campo}`;
      const estaEditando = camposEditando[clave] === campo;

      const camposNoEditables = ['id', 'fechaCreacion', 'ultimaModificacion'];

      return (
        <div key={campo} className="campo-producto" style={{ marginBottom: '0.5rem' }}>
          <span className="campo-nombre">{campo}:</span>{' '}
          {camposNoEditables.includes(campo) ? (
            <span className="campo-valor">{String(valor)}</span>
          ) : estaEditando ? (
            <>
            <input
              className="input-editar"
              type="text"
              placeholder={String(valor)}
              value={valoresTemporales[clave] || ''}
              style={{
                width: `${autoWidth(valoresTemporales[clave] || String(valor), '16px Arial') + 20}px`,
              }}
              onChange={(e) =>
                setValoresTemporales((prev) => ({
                  ...prev,
                  [clave]: e.target.value,
                }))
              }
            />
              <button onClick={() => guardarCampo(prod.id, campo)} className="edit-button">Guardar</button>
              {/* Botón Cancelar */}
    <button
      onClick={() => {
        setCamposEditando(prev => {
          const copia = {...prev};
          delete copia[clave];
          return copia;
        });
        setValoresTemporales(prev => {
          const copia = {...prev};
          delete copia[clave];
          return copia;
        });
      }}
      className="cancel-button"
      style={{ marginLeft: '0.5rem' }}
    >
      Cancelar
    </button>
            </>
          ) : (
              <>
                <span className="campo-valor">{String(valor)}</span>
                <button
                  className="edit-button"
                  style={{ marginLeft: '0.5rem' }}
                  onClick={() => editarCampo(prod.id, campo, String(valor))}
                >
                  Editar
                </button>
              </>
            )}
      
    </div>
        );
            })    }
                          </div>
                        )}
                      </div>
                    ))
                  )}
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
    
    