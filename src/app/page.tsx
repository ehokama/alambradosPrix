"use client";
import Image from 'next/image';
import Link from 'next/link';

import { useState } from "react";
import { generarPDF } from './utils/creadorpdf';

export default function HomePage() {

    const initialFormData = {
    materialPoste: "hormigon",
    tipoHormigon: "olimpico",
    alturaRolloTejido: "Tejido romboidal 1mts",
    grosorAlambre: "",
    cantidadLineasPuas: "",
    cantidadEsquineros: "",
    cantidadRefuerzos: "",
    cantidadIntermedios: "",
    cantidadPuntales: "",
    metrosLineales: "",
    cantidadPlanchuelas: "",
    medidaPlanchuela: "",
    cantidadTorniquetes: "",
    tipoTorniquete: "",
    cantidadAlambres: "",
    tipoAlambre: "",
    cantidadGanchos: "",
    tipoGancho: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLimpiar = () => {
    setFormData(initialFormData);
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
              <form>
                <div className="campo">
                  <label htmlFor="materialPoste">Material del poste</label>
                  <select name="materialPoste" value={formData.materialPoste} onChange={handleChange}>
                    <option value="quebracho">Quebracho</option>
                    <option value="hormigon">Hormigón</option>
                  </select>
                </div>

              {formData.materialPoste === "hormigon" && (
                <div className="campo">
                  <label htmlFor="tipoHormigon">Tipo de Poste de Hormigón</label>
                  <select id="tipoHormigon" name="tipoHormigon" value={formData.tipoHormigon} onChange={handleChange}>
                    <option value="olimpico">Olimpico</option>
                    <option value="recto1.5m">Recto de 1,5mts</option>
                    <option value="recto2m">Recto de 2mts</option>
                  </select>
                </div>
              )}


              {formData.materialPoste === "hormigon" && formData.tipoHormigon === "olimpico" && (
                <div className="campo">
                  <label htmlFor="cantidadLineasPuas">Cantidad de lineas de puas</label>
                  <input type="number" id="cantidadLineasPuas" name="cantidadLineasPuas" value={formData.cantidadLineasPuas} onChange={handleChange}/>
                </div>
              )}


              <hr />


              <div className="campo">
                <label htmlFor="cantidadEsquineros">Cantidad de Esquineros</label>
                <input type="number" id="cantidadEsquineros" name="cantidadEsquineros" value={formData.cantidadEsquineros} onChange={handleChange}/>
              </div>

              <div className="campo">
                <label htmlFor="cantidadRefuerzos">Cantidad de Refuerzos</label>
                <input type="number" id="cantidadRefuerzos" name="cantidadRefuerzos" value={formData.cantidadRefuerzos} onChange={handleChange}/>
              </div>

              <div className="campo">
                <label htmlFor="cantidadIntermedios">Cantidad de Intermedios</label>
                <input type="number" id="cantidadIntermedios" name="cantidadIntermedios" value={formData.cantidadIntermedios} onChange={handleChange}/>
              </div>

              <div className="campo">
                <label htmlFor="cantidadPuntales">Cantidad de Puntales</label>
                <input type="number" id="cantidadPuntales" name="cantidadPuntales" value={formData.cantidadPuntales} onChange={handleChange}/>
              </div>


              <hr/>


              <div className="campo">
                <label htmlFor="alturaRolloTejido">Altura del rollo de tejido</label>
                <select id="alturaRolloTejido" name="alturaRolloTejido" value={formData.alturaRolloTejido} onChange={handleChange}>
                  <option value="Tejido romboidal 1mts">Tejido romboidal 1mts</option>
                  <option value="Tejido romboidal 1,25mts">Tejido romboidal 1,25mts</option>
                  <option value="Tejido romboidal 1,5mts">Tejido romboidal 1,5mts</option>
                  <option value="Tejido romboidal 1,8mts">Tejido romboidal 1,8mts</option>
                  <option value="Tejido romboidal 2mts">Tejido romboidal 2mts</option>
                </select>
              </div>

              {["Tejido romboidal 1mts", "Tejido romboidal 1,25mts", "Tejido romboidal 1,8mts"].includes(formData.alturaRolloTejido) && (
              <div className="campo">
                <label htmlFor="grosorAlambre">Diámetro o grosor del alambre</label>
                <select id="grosorAlambre" name="grosorAlambre" value={formData.grosorAlambre} onChange={handleChange}>
                  <option value="2,5pulgadas">2,5 pulgadas</option>
                </select>
              </div>
              )}
              {["Tejido romboidal 1,5mts", "Tejido romboidal 2mts"].includes(formData.alturaRolloTejido) && (
              <div className="campo">
                <label htmlFor="grosorAlambre">Diámetro o grosor del alambre</label>
                <select id="grosorAlambre" name="grosorAlambre" value={formData.grosorAlambre} onChange={handleChange}>
                  <option value="2 pulgadas">2 pulgadas</option>
                  <option value="2,5 pulgadas">2,5 pulgadas</option>
                </select>
              </div>
              )}


              <div className="campo">
                <label htmlFor="metrosLineales">Metros lineales</label>
                <input type="number" id="metrosLineales" name="metrosLineales" min="1" placeholder="Ej: 10mts" value={formData.metrosLineales} onChange={handleChange}/>
              </div>

              <hr/>

              <div className="campo">
                <label htmlFor="cantidadPlanchuelas">Cantidad de Planchuelas Galvanizadas</label>
                <input type="number" id="cantidadPlanchuelas" name="cantidadPlanchuelas" min="1" value={formData.cantidadPlanchuelas} onChange={handleChange}/>
              </div>
              <div className="campo">
                <label htmlFor="medidaPlanchuela">Medida de Planchuelas</label>
                <select id="medidaPlanchuela" name="medidaPlanchuela" value={formData.medidaPlanchuela} onChange={handleChange}>
                  <option value="1m">1m</option>
                  <option value="1,25m">1,25m</option>
                  <option value="1,5m">1,5m</option>
                  <option value="1,8m">1,8m</option>
                  <option value="2m">2m</option>
                </select>
              </div>

              <hr/>

              <div className="campo">
                <label htmlFor="cantidadTorniquetes">Cantidad de Torniquetes</label>
                <input type="number" id="cantidadTorniquetes" name="cantidadTorniquetes" min="1" value={formData.cantidadTorniquetes} onChange={handleChange} />
              </div>
              <div className="campo">
                <label htmlFor="tipoTorniquete">Torniquetes</label>
                <select id="tipoTorniquete" name="tipoTorniquete" value={formData.tipoTorniquete} onChange={handleChange}>
                  <option value="N5">Torniquete galvanizado Nro 5</option>
                  <option value="N7">Torniquete galvanizado Nro 7</option>
                </select>
              </div>


              <hr/>


              <div className="campo">
                <label htmlFor="cantidadAlambres">Metros lineales de Alambre</label>
                <input type="number" id="cantidadAlambres" name="cantidadAlambres" min="1" value={formData.cantidadAlambres} onChange={handleChange} />
              </div>
              <div className="campo">
                <label htmlFor="tipoAlambre">Tipo de alambre</label>
                <select id="tipoAlambre" name="tipoAlambre" value={formData.tipoAlambre} onChange={handleChange}>
                  <option value="lisoGalvanizado">Alambre Liso Galvanizado</option>
                </select>
              </div>


              <hr/>


              <div className="campo">
                <label htmlFor="cantidadGanchos">Cantidad de ganchos</label>
                <input type="number" id="cantidadGanchos" name="cantidadGanchos" min="1" value={formData.cantidadGanchos} onChange={handleChange} />
              </div>
              <div className="campo">
                <label htmlFor="tipoGancho">Tipo de gancho</label>
                <select id="tipoGancho" name="tipoGancho" value={formData.tipoGancho} onChange={handleChange}>
                  <option value="tor7">TOR.T/ALAMBRE x7</option>
                  <option value="tor8">TOR.T/ALAMBRE x8</option>
                  <option value="palomita">Palomita Galvanizada</option>
                  <option value="esparrago250">Esparrago Galvanizado de 250mm</option>
                  <option value="esparrago360">Esparrago Galvanizado de 360mm</option>
                </select>
              </div>
              </form>


              <div className="buttons">
                <button className="limpiar-btn" onClick={handleLimpiar}>Limpiar</button>
                <button className="calcular-btn">Calcular</button>
              </div>
            </div>
          </div>


          <div className="calculadora-right">
            <div className="calculadora-right-background">
              <h3>Resumen de cotización</h3>  
              <p>Completa el formulario y presiona "Calcular" para ver el presupuesto.</p>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button className="descargar-btn" onClick={() => generarPDF("Cliente XYZ")}>Descargar PDF</button>
              </div>    
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