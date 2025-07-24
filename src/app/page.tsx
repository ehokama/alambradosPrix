// src/app/page.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* HEADER */}
      <header className="main-header">
        <div className="marca">
          <Link href="/configuracion">
            <Image src="/images/prix_img.jpeg" alt="titulo" width={100} height={100} />
          </Link>
        </div>
        <div className="iconos-header">
          <Link href="/configuracion">
            <Image src="/images/configuracion_img.png" alt="Configuración" width={30} height={30} />
            Configuración
          </Link>
        </div>
      </header>

      {/* CALCULADORA */}
      <section className="calculadora">
        <div className="calculadora-header">
          <h1>Calculadora de Presupuesto</h1>
          <h3>Cotiza al instante tus materiales</h3>
        </div>

        <div className="calculadora-body">
          <div className="calculadora-left">
            <div className="calculadora-left-background">
              {/* campos del formulario */}
              {/* Usar labels, selects e inputs normalmente */}
            </div>
          </div>

          <div className="calculadora-right">
            <div className="calculadora-right-background">
              <h3>Resumen de cotización</h3>
              <p>Completa el formulario para ver el presupuesto.</p>
              <hr />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="main-footer">
        <p>&copy; Alambrados Prix.</p>
      </footer>
    </>
  );
}
