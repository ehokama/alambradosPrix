import { useState, useEffect } from "react";
import { generarTipoFacturaPDF } from "./DescargarTipoFacturaPDF";
import { generarInformativoPDF } from "./DescargarInformativoPDF";
import { obtenerDocumentosDeColeccion } from "@/app/utils/firestoreUtils";
import { Producto, ProductoSeleccionado } from "@/types/productos";

export default function BuscadorProductos() {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [productosBase, setProductosBase] = useState<Producto[]>([]);

  const costoTotal = seleccionados.reduce((total, producto) => {
    return total + producto.precioUnitario * producto.cantidad;
  }, 0);
  const preciofinal = seleccionados.reduce((total, producto) => {
      if (producto.tipo === "Porton" || producto.tipo === "Puerta") {
        return total + producto.precioUnitario * producto.cantidad;
      }else{
        return total + ( ( (producto.precioUnitario * (1-producto.bonificacion) ) * 1.21 * ( 1 + producto.recargo ) ) * (1 + producto.margenGanancia)  ) * producto.cantidad;
      }

  }, 0);

  useEffect(() => {
    const fetchProductos = async () => {
      const productos = await obtenerDocumentosDeColeccion<Producto>("productos");
      setProductosBase(productos);
    };
    fetchProductos();
  }, []);

  const resultados = busqueda.length > 0
    ? productosBase.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : [];

  const agregarProducto = (producto: Producto) => {
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
            {p.nombre} - ${p.precioUnitario.toLocaleString()}
          </div>
        ))}
      </div>

      <div id="seleccionados">
        <h2>Productos seleccionados</h2>
        <div id="lista">
          {seleccionados.map((p, i) => (
            <div key={i} className="producto-seleccionado">
              <div>{p.nombre} - ${p.precioUnitario.toLocaleString()}</div>
              <input type="number" min={0} value={p.cantidad === 0 ? '' : p.cantidad} className="cantidad-input" style={{ margin: '10px' }} 
              onChange={e => {
              const value = e.target.value;
              const cantidad = value === '' ? 0 : parseInt(value);
              cambiarCantidad(i, isNaN(cantidad) ? 0 : cantidad);
            }}
              />
              <button className="boton-eliminar" style={{ marginLeft: '10px' }} onClick={() => eliminarProducto(i)}>
                Eliminar
              </button>
            </div>
          ))}
            {/* Total al final */}
            <div className="total-costo" style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Costo total (Prebono, iva, recargo y bonificación ): ${costoTotal.toFixed(2)}
            </div>
            <div className="precio-final" style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Precio final (Para cliente): ${preciofinal.toFixed(2)}
            </div>
          {seleccionados.length > 0 && (
            <div className="botones">
              <button className="boton-descargar" onClick={() => generarInformativoPDF("Agustina Selaya")}>Descargar PDF Informativo</button>
              <button className="boton-descargar" onClick={() => generarTipoFacturaPDF("Agustina Selaya", seleccionados)}>Descargar PDF Tipo Factura</button>
              <button className="boton-limpiar" onClick={limpiar}>Limpiar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
