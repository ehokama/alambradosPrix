'use client';

import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/firebase/config';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { obtenerDocumentosPorCampo, obtenerDocumentoPorCampo } from '@/app/utils/firestoreUtils';
import { obtenerFechaFormateada } from '../utils/fecha';
import { autoWidth } from '../utils/autowidth';
import { ProductoBase, Usuario } from '@/types/productos';

export default function ConfigPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [categoria, setCategoria] = useState<string>('Poste');
  const [productos, setProductos] = useState<(ProductoBase & Partial<Record<string, string>>)[]>([]);
  const [productosAbiertos, setProductosAbiertos] = useState<Set<string>>(new Set());
  const [camposEditando, setCamposEditando] = useState<Record<string, string | null>>({});
  const [valoresTemporales, setValoresTemporales] = useState<Record<string, string>>({});

  // Verifica login
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

  // Carga productos al tener categoría y usuario
  useEffect(() => {
    if (user) {
      cargarProductos(categoria);
    }
  }, [categoria, user]);

  const cargarProductos = async (categoria: string) => {
    const docs = await obtenerDocumentosPorCampo<ProductoBase & Partial<Record<string, string>>>(
      'productos',
      'tipo',
      categoria
    );
    const ordenados = docs.sort((a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? ''));
    setProductos(ordenados);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(e.target.value);
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
    if (!nuevoValor || nuevoValor.trim() === '') return;

    try {
      const productoRef = doc(db, 'productos', id);
      await updateDoc(productoRef, {
        [campo]: nuevoValor,
        ultimaModificacion: obtenerFechaFormateada(),
      });

      const productoModificado = productos.find((p) => p.id === id);

      let autor = 'Usuario desconocido';
      if (user?.email) {
        const docsUsuario = await obtenerDocumentoPorCampo<Usuario>('usuarios', 'email', user.email);
        if (docsUsuario?.nombre?.trim()) {
          autor = docsUsuario.nombre;
        }
      }

      const descripcion = `${autor} cambió el campo "${campo}" de "${productoModificado?.nombre ?? 'producto'}" a "${nuevoValor}"`;

      await addDoc(collection(db, 'actualizaciones'), {
        tipo: 'Actualizacion',
        autor,
        fecha: obtenerFechaFormateada(),
        descripcion,
      });

      setProductos((prev) =>
        prev.map((prod) =>
          prod.id === id
            ? { ...prod, [campo]: nuevoValor, ultimaModificacion: obtenerFechaFormateada() }
            : prod
        )
      );

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

  // Si aún se está verificando la sesión
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
        <h1 className="title-text">Configuración</h1>

        <div className="config-container">
          <h2>Seleccionar categoría de productos</h2>
          <select value={categoria} onChange={handleCategoriaChange} id='categoria'>
            <option value="Poste">Postes</option>
            <option value="Tejido">Tejidos</option>
            <option value="Puerta">Puertas</option>
            <option value="Porton">Portones</option>
            <option value="Accesorio">Otros (accesorios, ganchos, etc)</option>
          </select>

          <div id="productos">
            <h2>Lista de productos:</h2>
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
                        if (campo === 'id') return null;
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
                                <button onClick={() => guardarCampo(prod.id, campo)} className="edit-button">
                                  Guardar
                                </button>
                                <button
                                  onClick={() => {
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
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="final-body">
        <button onClick={handleLogout} className="boton-cerrarSesion">
          Cerrar sesión
        </button>
      </div>
    </>
  );
}
