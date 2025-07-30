type autoWidth = {
  (texto: string, font?: string): number;
  canvas?: HTMLCanvasElement;
};

export const autoWidth: autoWidth = (texto, font = '16px Arial') => {
  const canvas = autoWidth.canvas || (autoWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  if (!context) return 100;
  context.font = font;
  const metrics = context.measureText(texto);
  return metrics.width;
};
