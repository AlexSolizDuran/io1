"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
type restre = {
  id: number;
  valor: [number, number, number];
  igual: string;
};
type lista = {
  restreccion: restre[];
};
type recta = {
  id: number;
  punto1: [number, number];
  punto2: [number, number];
  color: string;
};
export default function Grafica({ restreccion }: lista) {
  const colorAleatorio = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
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
      range: [0, 20],
      title: "x",
      tickvals: Array.from({ length: 21 }, (_, i) => i),
      showgrid: true,
      gridcolor: "#ccc",
    },
    yaxis: {
      range: [0, 20],
      title: "y",
      tickvals: Array.from({ length: 21 }, (_, i) => i),
      scaleanchor: "x",
      showgrid: true,
      gridcolor: "#ccc",
    },
    showlegend: true,
  };

  return (
    <div>
      <h1></h1>
      <div>
        <Plot data={data} layout={layout}></Plot>
      </div>
    </div>
  );
}
