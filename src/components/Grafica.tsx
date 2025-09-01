"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
// una estructura para la restriccion
type restre = {
  id: number;
  valor: [number, number, number];
  igual: string;
};
// estructura para recibir la lista de restricciones
type lista = {
  zeta : {valor:[number,number]}
  restreccion: restre[];
};
//estructura para guardar los puntos de cada restriccion
type recta = {
  id: number;
  punto1: [number, number];
  punto2: [number, number];
  color: string;
};
export default function Grafica({ restreccion,zeta }: lista) {
  // funcion auxiliar para obtener un color aleatorio retorna un string
  const colorAleatorio = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  // el hook para que las rectas se grafiquen en el servidor del cliente
  const [intersecciones, setIntersecciones] = useState<recta[]>([]);
  useEffect(() => {
    const puntos: recta[] = restreccion.map((r) => {
      const [a, b, c] = r.valor;
      const punto1: [number, number] | undefined =
        a !== 0 ? [c / a, 0] : [0, 0];
      const punto2: [number, number] | undefined =
        b !== 0 ? [0, c / b] : [0, 0];
      const color = colorAleatorio();
      return {
        id: r.id,
        punto1,
        punto2,
        color,
      };
    });
    setIntersecciones(puntos);
  }, [restreccion]);

  // crea las rectas en una lista
  const data = intersecciones.map((rec) => ({
    x: rec.punto1,
    y: rec.punto2,
    type: "scatter",
    mode: "lines",
    line: rec.color,
    name: `recta ${rec.id}`,
  }));

  const layout = {
    // algunas opciones para la grafica
    xaxis: {
      range: [0, 15],
      title: "x",
      tickvals: Array.from({ length: 16 }, (_, i) => i),
      zeroline: true,
    },
    yaxis: {
      range: [0, 15],
      title: "y",
      tickvals: Array.from({ length: 16 }, (_, i) => i),
      scaleanchor: "x",
      zeroline: true,
    },
    showlegend: true,
    margin: { t: 20, r: 20, l: 20, b: 20 },
  };

  return (
    <div>
      <h1></h1>
      <div className="">
        <Plot data={data} layout={layout}></Plot>
      </div>
    </div>
  );
}
