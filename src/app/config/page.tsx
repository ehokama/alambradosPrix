import Image from 'next/image';
import Link from 'next/link';
import './config.css';


export default function ConfigPage() {
  return (
    <>
      {/* HEADER */}
      <header className="main-header">
        <div className="marca">
          <Link href="/">
            <Image src="/images/prix_img.jpeg" alt="titulo" width={100} height={100} unoptimized/>
          </Link>
        </div>
        <div className="iconos-header">
          <Link href="/">
            <Image src="/images/presupuesto_img.png" alt="Presupuesto" width={30} height={30} unoptimized/>
            Presupuesto
          </Link>
        </div>
      </header>

      {/* CALCULADORA */}

      <section className="configuracion">

        <div className="configuracion-header">
          <h1>Configuración</h1>
          <h3>Productos, precios, medidas</h3>
        </div>

        <div className="producto">

          <p>Postes</p>
          <div id="postes-container">
            <div className="poste">
              <input type="text" placeholder="Tipo de Poste" className="poste-tipo" />
              <input type="number" placeholder="Precio" className="poste-precio" />
                <button className="eliminar-btn">Eliminar</button>
            </div>
          </div>
          <button className="agregar-btn">Agregar Poste</button>

        </div>


      </section>

      <button className="logout-btn">Cerrar sesión</button>

      {/* FOOTER */}
      <footer className="main-footer">
        <p>&copy; Alambrados Prix.</p>
      </footer>
    </>
  );
}
