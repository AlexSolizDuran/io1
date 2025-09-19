// ==================== UTILIDADES PARA PLOTLY ====================

import { PuntoRecta, PuntoFactible, MAX_RANGE } from '../types/programacion-lineal';

/**
 * Genera los datos para graficar las rectas de restricciones
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generarDatosRectas = (intersecciones: PuntoRecta[]): any[] => {
  return intersecciones.map((recta) => ({
    x: [recta.punto1[0], recta.punto2[0]],
    y: [recta.punto1[1], recta.punto2[1]],
    type: "scatter",
    mode: "lines",
    line: { color: recta.color },
    name: `Restricción ${recta.id}`,
  }));
};

/**
 * Genera los datos para graficar los puntos extremos (máximo y mínimo)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generarDatosExtremos = (maximo: PuntoFactible | null, minimo: PuntoFactible | null): any[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datos: any[] = [];
  
  if (maximo) {
    datos.push({
      x: [maximo.punto[0]],
      y: [maximo.punto[1]],
      mode: "markers+text",
      type: "scatter",
      name: "Máximo",
      marker: { color: "red", size: 12, symbol: "star" },
      text: [`Z=${maximo.valor.toFixed(2)}`],
      textposition: "top center"
    });
  }

  if (minimo) {
    datos.push({
      x: [minimo.punto[0]],
      y: [minimo.punto[1]],
      mode: "markers+text",
      type: "scatter",
      name: "Mínimo",
      marker: { color: "green", size: 12, symbol: "star" },
      text: [`Z=${minimo.valor.toFixed(2)}`],
      textposition: "top center"
    });
  }

  return datos;
};

/**
 * Genera los datos para graficar el área factible
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generarDatosAreaFactible = (puntosFactibles: [number, number][]): any[] => {
  if (puntosFactibles.length === 0) return [];

  // Ordenar puntos por ángulo polar para cerrar bien el polígono
  const centro = puntosFactibles.reduce(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y],
    [0, 0]
  ).map(v => v / puntosFactibles.length) as [number, number];

  const ordenados = [...puntosFactibles].sort((p1, p2) => {
    const ang1 = Math.atan2(p1[1] - centro[1], p1[0] - centro[0]);
    const ang2 = Math.atan2(p2[1] - centro[1], p2[0] - centro[0]);
    return ang1 - ang2;
  });

  return [{
    x: ordenados.map(p => p[0]),
    y: ordenados.map(p => p[1]),
    type: "scatter",
    mode: "lines",
    fill: "toself",
    name: "Área Factible",
    fillcolor: "rgba(0,200,100,0.2)",
    line: { color: "green" }
  }];
};

/**
 * Genera el layout para el gráfico de Plotly
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generarLayout = (): any => ({
  xaxis: {
    range: [0, MAX_RANGE],
    title: { text: "x" },
    tickvals: Array.from({ length: MAX_RANGE + 1 }, (_, i) => i),
    zeroline: true,
  },
  yaxis: {
    range: [0, MAX_RANGE],
    title: { text: "y" },
    tickvals: Array.from({ length: MAX_RANGE + 1 }, (_, i) => i),
    scaleanchor: "x",
    zeroline: true,
  },
  showlegend: true,
  margin: { t: 20, r: 20, l: 20, b: 20 },
});
