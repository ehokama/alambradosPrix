'use client';

import { useState } from 'react';
import { generarPDF } from './DescargarTipoFacturaPDF';

const productosBase = [
  { nombre: "Tejido Romboidal - 56mm - Malla 2'' - Espesor 11 (2,95mm) - x 10mts (PUNTA CERRADA)", precio: 14500 },
  { nombre: "POSTE-INTERMEDIO-RECTO-HORMIGÓN (PARA TEJIDO DE 1.50 ALTO)", precio: 13200 },
  { nombre: "Poste-Intermedio-Recto-Hormigón (Para Tejido de 1.50 Alto)''", precio: 351552 },
  { nombre: "Torniquete galvanizado 1/4\"", precio: 120 },
  { nombre: "Paloma de alambre reforzada", precio: 80 },
  { nombre: "Puerta reforzada 2 hojas 3m", precio: 75400 },
  { nombre: "Planchela con agujeros galvanizada", precio: 540 }
];

export default function BuscadorProductos() {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<any[]>([]);

  const resultados = busqueda.length > 0
    ? productosBase.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : [];

  const agregarProducto = (producto: any) => {
    if (seleccionados.some(s => s.nombre === producto.nombre)) return;
    setSeleccionados([...seleccionados, { ...producto, cantidad: 1 }]);
    setBusqueda('');
  };

  const eliminarProducto = (index: number) => {
    const copia = [...seleccionados];
    copia.splice(index, 1);
    setSeleccionados(copia);
  };

  const cambiarCantidad = (index: number, cantidad: number) => {
    const copia = [...seleccionados];
    copia[index].cantidad = cantidad;
    setSeleccionados(copia);
  };

  const limpiar = () => setSeleccionados([]);

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Buscar Productos</h1>
      <input
        type="text"
        id="buscador"
        placeholder="Escribí el nombre del producto..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        autoComplete="off"
      />

      <div id="resultados">
        {resultados.length === 0 && busqueda.length > 0 && <div className="item">No se encontraron productos</div>}
        {resultados.map((p, i) => (
          <div key={i} className="item" onClick={() => agregarProducto(p)}>
            {p.nombre} - ${p.precio.toLocaleString()}
          </div>
        ))}
      </div>

      <div id="seleccionados">
        <h2>Productos seleccionados</h2>
        <div id="lista">
          {seleccionados.map((p, i) => (
            <div key={i} className="producto-seleccionado">
              <div>{p.nombre} - ${p.precio.toLocaleString()}</div>
              <input
                type="number"
                min={1}
                value={p.cantidad}
                className="cantidad-input"
                style={{ margin: '10px' }}
                onChange={e => cambiarCantidad(i, parseInt(e.target.value) || 1)}
              />
              <button className="boton-eliminar" style={{ marginLeft: '10px' }} onClick={() => eliminarProducto(i)}>
                Eliminar
              </button>
            </div>
          ))}

          {seleccionados.length > 0 && (
            <div className="botones">
              <button className="boton-descargar">Descargar PDF Informativo</button>
              <button className="boton-descargar" onClick={() => generarPDF("Agustina Selaya")}>Descargar PDF Tipo Factura</button>
              <button className="boton-limpiar" onClick={limpiar}>Limpiar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
