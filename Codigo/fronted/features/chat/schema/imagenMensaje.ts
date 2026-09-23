/** Imagen que el agente adjunta a una respuesta, ya normalizada para la UI. */
export interface ImagenMensaje {
  url: string;
  /** Pie de foto opcional: nombre del plato, precio, lo que mande el agente. */
  descripcion?: string;
  /** Producto al que pertenece, si el agente lo indica. */
  productoId?: string;
}
