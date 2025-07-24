"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";

export default function HomePage() {

  const [materialPoste, setMaterialPoste] = useState("quebracho");
  const [alturaRolloTejido, setAlturaRolloTejido] = useState("1m");
  const [tipoHormigon, setTipoHormigon] = useState("olimpico");

  const handleMaterialPosteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMaterialPoste(event.target.value);
  };

  const handleAlturaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  setAlturaRolloTejido(event.target.value);
  };

  const handleTipoHormigonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoHormigon(event.target.value);
  };


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
          <Link href="/config">
            <Image src="/images/configuracion_img.png" alt="Configuración" width={30} height={30} unoptimized/>
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

              <div className="campo">
                <label htmlFor="materialPoste">Material del poste</label>
                <select id="materialPoste" name="materialPoste" onChange={handleMaterialPosteChange} value={materialPoste}>
                  <option value="quebracho">Quebracho</option>
                  <option value="hormigon">Hormigón</option>
                </select>
              </div>

              {materialPoste === "hormigon" && (
                <div className="campo">
                  <label htmlFor="tipoHormigon">Tipo de Poste de Hormigón</label>
                  <select id="tipoHormigon" name="tipoHormigon" onChange={handleTipoHormigonChange} value={tipoHormigon}>
                    <option value="olimpico">Olimpico</option>
                    <option value="recto1.5m">Recto de 1,5mts</option>
                    <option value="recto2m">Recto de 2mts</option>
                  </select>
                </div>
              )}


              {materialPoste === "hormigon" && tipoHormigon === "olimpico" && (
                <div className="campo">
                  <label htmlFor="cantidadLineasPuas">Cantidad de lineas de puas</label>
                  <input type="number" id="cantidadLineasPuas" name="cantidadLineasPuas"/>
                </div>
              )}


              <hr />


              <div className="campo">
                <label htmlFor="cantidadEsquineros">Cantidad de Esquineros</label>
                <input type="number" id="cantidadEsquineros" name="cantidadEsquineros"/>
              </div>

              <div className="campo">
                <label htmlFor="cantidadRefuerzos">Cantidad de Refuerzos</label>
                <input type="number" id="cantidadRefuerzos" name="cantidadRefuerzos"/>
              </div>

              <div className="campo">
                <label htmlFor="cantidadIntermedios">Cantidad de Intermedios</label>
                <input type="number" id="cantidadIntermedios" name="cantidadIntermedios"/>
              </div>

              <div className="campo">
                <label htmlFor="cantidadPuntales">Cantidad de Puntales</label>
                <input type="number" id="cantidadPuntales" name="cantidadPuntales"/>
              </div>


              <hr/>


              <div className="campo">
                <label htmlFor="alturaRolloTejido">Altura del rollo de tejido</label>
                <select id="alturaRolloTejido" name="alturaRolloTejido" onChange={handleAlturaChange} value={alturaRolloTejido}>
                  <option value="1m">1m</option>
                  <option value="1,25m">1,25m</option>
                  <option value="1,5m">1,5m</option>
                  <option value="1,8m">1,8m</option>
                  <option value="2m">2m</option>
                </select>
              </div>

              {["1m", "1,25m", "1,8m"].includes(alturaRolloTejido) && (
              <div className="campo">
                <label htmlFor="grosorAlambre">Diámetro o grosor del alambre</label>
                <select id="grosorAlambre" name="grosorAlambre">
                  <option value="2,5pulgadas">2,5 pulgadas</option>
                </select>
              </div>
              )}
              {["1,5m", "2m"].includes(alturaRolloTejido) && (
              <div className="campo">
                <label htmlFor="grosorAlambre">Diámetro o grosor del alambre</label>
                <select id="grosorAlambre" name="grosorAlambre">
                  <option value="2pulgadas">2 pulgadas</option>
                  <option value="2,5pulgadas">2,5 pulgadas</option>
                </select>
              </div>
              )}


              <div className="campo">
                <label htmlFor="metrosLineales">Metros lineales</label>
                <input type="number" id="metrosLineales" name="metrosLineales" min="1" placeholder="Ej: 10mts"/>
              </div>

              <hr/>

              <div className="campo">
                <label htmlFor="planchuelas">Cantidad de Planchuelas Galvanizadas</label>
                <input type="number" id="planchuelas" name="planchuelas" min="1" />
              </div>
              <div className="campo">
                <label htmlFor="medidaPlanchuela">Medida de Planchuelas</label>
                <select id="medidaPlanchuela" name="medidaPlanchuela">
                  <option value="1m">1m</option>
                  <option value="1,25m">1,25m</option>
                  <option value="1,5m">1,5m</option>
                  <option value="1,8m">1,8m</option>
                  <option value="2m">2m</option>
                </select>
              </div>

              <hr/>

              <div className="campo">
                <label htmlFor="torniquetes">Cantidad de Torniquetes</label>
                <input type="number" id="torniquetes" name="torniquetes" min="1" />
              </div>
              <div className="campo">
                <label htmlFor="tipoTorniquete">Torniquetes</label>
                <select id="tipoTorniquete" name="tipoTorniquete">
                  <option value="N5">N°5</option>
                  <option value="N7">N°7</option>
                </select>
              </div>


              <hr/>


              <div className="campo">
                <label htmlFor="alambres">Metros lineales de Alambre</label>
                <input type="number" id="alambres" name="alambres" min="1" />
              </div>
              <div className="campo">
                <label htmlFor="tipoAlambre">Tipo de alambre</label>
                <select id="tipoAlambre" name="tipoAlambre">
                  <option value="lisoGalvanizado">Liso Galvanizado</option>
                </select>
              </div>


              <hr/>


              <div className="campo">
                <label htmlFor="ganchos">Cantidad de ganchos</label>
                <input type="number" id="ganchos" name="ganchos" min="1" />
              </div>
              <div className="campo">
                <label htmlFor="tipoGancho">Tipo de gancho</label>
                <select id="tipoGancho" name="tipoGancho">
                  <option value="tor7">TOR.T/ALAMBRE x7</option>
                  <option value="tor8">TOR.T/ALAMBRE x8</option>
                  <option value="palomita">Palomita Galvanizada</option>
                  <option value="esparrago250">Esparrago Galvanizado de 250mm</option>
                  <option value="esparrago360">Esparrago Galvanizado de 360mm</option>
                </select>
              </div>


              <div className="buttons">
                <button className="limpiar-btn">Limpiar</button>
                <button className="calcular-btn">Calcular</button>
              </div>
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
