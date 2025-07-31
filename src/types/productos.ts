export interface ProductoBase {
    id: string;
    nombre: string;
    tipo: string;
    precioUnitario: number;
    margenGanancia: number;
    fechaCreacion: string;
    bonificacion: number;
    ultimaModificacion: string;
    recargo: number;
}


export interface ProductoAccesorio extends ProductoBase {
  subtipo: string;
}

export interface ProductoPoste extends ProductoBase {
  pesoAprox: string;
  material: string;
}

export interface ProductoPorton extends ProductoBase {
  subtipo: string;
  material: string;
}

export interface ProductoPuerta extends ProductoBase {
  subtipo: string;
  material: string;
}

export type Producto =
  | ProductoAccesorio
  | ProductoPoste
  | ProductoPorton
  | ProductoPuerta;


  export type ProductoSeleccionado = Producto & { cantidad: number };

  export interface Usuario {
  nombre: string;
  email: string;
}

export interface Actualizacion {
  id: string;
  fecha: string;
  usuario: string;
  descripcion: string;
}

export interface Presupuesto {
  id: string;
  fecha: string;
  usuario: string;

  cliente: string;
  ubicacion: string;
  obra: string;
  
  productos: string;
  total: number;
}
