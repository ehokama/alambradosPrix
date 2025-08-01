import { useState, useEffect } from "react";
import { generarTipoFacturaPDF } from "./DescargarTipoFacturaPDF";
import { generarInformativoPDF } from "./DescargarInformativoPDF";
import { obtenerDocumentosDeColeccion } from "@/app/utils/firestoreUtils";
import { Producto, ProductoSeleccionado } from "@/types/productos";

export default function BuscadorProductos() {
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [productosBase, setProductosBase] = useState<Producto[]>([]);
  const [manoDeObraViaticos, setManoDeObraViaticos] = useState("");
//datos
  const [nombreCliente, setNombreCliente] = useState('');
  const [ubicacionCliente, setUbicacionCliente] = useState('');
  const [obraCliente, setObraCliente] = useState('');

  const viaticos = parseFloat(manoDeObraViaticos) || 0;
  const costoTotal = seleccionados.reduce((total, producto) => {
    return total + producto.precioUnitario * producto.cantidad ;
  }, 0);
  const preciofinal = seleccionados.reduce((total, producto, manoDeObraViaticos) => {
      if (producto.tipo === "Porton" || producto.tipo === "Puerta") {
        return total + producto.precioUnitario * producto.cantidad + manoDeObraViaticos;
      }if (producto.tipo === "Poste" ){
        return total + ( ( (producto.precioUnitario * (1-producto.bonificacion) ) * ( 1 + producto.recargo ) ) * (1 + producto.margenGanancia)  ) * producto.cantidad + manoDeObraViaticos; // sin iva??
      }else{
        return total + ( ( (producto.precioUnitario * (1-producto.bonificacion) ) * 1.21 * ( 1 + producto.recargo ) ) * (1 + producto.margenGanancia)  ) * producto.cantidad + manoDeObraViaticos;
      }

  }, 0) + viaticos;

const itemManoDeObra: ProductoSeleccionado = {
  id: "manoDeObra",
  nombre: "Mano de obra y viáticos",
  precioUnitario: viaticos,
  cantidad: 1,
  tipo: "ManoDeObra", 
  bonificacion: 0,
  recargo: 0,
  margenGanancia: 0,
  fechaCreacion: new Date().toISOString(),
  ultimaModificacion: new Date().toISOString(),
};

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
      <h1 className="calculator-title">Datos del cliente</h1>
      <div className="datosCliente">
        <div className="campoCliente">
         <input
            type="text"
            className="inputDatoCliente"
            id="empresa"
            placeholder="Escribí el nombre de la empresa o particular..."
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </div>
      <div className="campoCliente">
        <input
          type="text"
          className="inputDatoCliente"
          id="ubicacion"
          placeholder="Escribí la ubicación de la instalación..."
          value={ubicacionCliente}
          onChange={(e) => setUbicacionCliente(e.target.value)}
        />
      </div>
      <div className="campoCliente">
        <input
          type="text"
          className="inputDatoCliente"
          id="obra"
          placeholder="Escribí la obra..."
          value={obraCliente}
          onChange={(e) => setObraCliente(e.target.value)}
        />
      </div>
      </div>
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
            <div className="extras" style={{ marginTop: '1rem' }}>
              <label className="label-mano-obra" style={{ fontWeight: "bold" }}>
                Mano de obra y viaticos ($):
                <input
                  type="number"
                  value={manoDeObraViaticos}
                  onChange={(e) => setManoDeObraViaticos(e.target.value)}
                  className="cantidad-input"
                  placeholder="Ingrese el monto de viaticos y mano de obra..."
                
                />
              </label>
            </div>


            <div className="total-costo" style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Costo total (SIN BONIFICACIÓN, IVA, RECARGO, GANANCIA, MANO DE OBRA NI VIATICOS ): ${costoTotal.toFixed(2)}
            </div>
            <div className="precio-final" style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Precio final para cliente (INCLUYE BONIFICACIÓN, IVA, RECARGO, GANANCIA, MANO DE OBRA Y VIATICOS): ${preciofinal.toFixed(2)}
            </div>
          {seleccionados.length > 0 && (
            <div className="botones">
              <button className="boton-descargar" onClick={() => generarInformativoPDF(nombreCliente, [...seleccionados, itemManoDeObra], ubicacionCliente, obraCliente)}>Descargar PDF Informativo</button>
              <button className="boton-descargar" onClick={() => generarTipoFacturaPDF(nombreCliente, [...seleccionados, itemManoDeObra], ubicacionCliente, obraCliente)}>Descargar PDF Tipo Factura</button>
              <button className="boton-limpiar" onClick={limpiar}>Limpiar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
