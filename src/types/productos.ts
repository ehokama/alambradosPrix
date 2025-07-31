export interface ProductoBase {
    id: string;
    nombre: string;
    tipo: string;
    precioUnitario: number;
    margenGanancia: number;
    fechaCreacion: string;
    bonificacion: number;
    ultimaModificacion: string;
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
