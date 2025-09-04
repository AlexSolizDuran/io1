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
  zeta: { valor: [number, number] };
  restreccion: restre[];
};

//estructura para guardar los puntos de cada restriccion
type recta = {
  id: number;
  punto1: [number, number];
  punto2: [number, number];
  color: string;
};

export default function Grafica({ restreccion, zeta }: lista) {
  // funcion auxiliar para obtener un color aleatorio retorna un string
  const colorAleatorio = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  // hook para que las rectas se grafiquen en el servidor del cliente
  const [intersecciones, setIntersecciones] = useState<recta[]>([]);

  // hook que se ejecuta al montar el componente
  useEffect(() => {
    const puntos: recta[] = restreccion.map((r) => {
      const [a, b, c] = r.valor;
      let punto1: [number, number];
      let punto2: [number, number];

      if (a === 0 && b === 0) {
        // Ecuación inválida
        punto1 = [0, 0];
        punto2 = [0, 0];
      } else if (a === 0) {
        // Recta horizontal: y = c/b
        const y = c / b;
        punto1 = [0, y];
        punto2 = [20, y]; // extendido al rango del layout
      } else if (b === 0) {
        // Recta vertical: x = c/a
        const x = c / a;
        punto1 = [x, 0];
        punto2 = [x, 20]; // extendido al rango del layout
      } else {
        // Caso general
        punto1 = [c / a, 0]; // intersección con eje X
        punto2 = [0, c / b]; // intersección con eje Y
      }
      const color = colorAleatorio();
      return {
        id: r.id,
        punto1,
        punto2,
        color
      };
    });

    setIntersecciones(puntos);
  }, [restreccion]);

  // crea las rectas en una lista
  const data = intersecciones.map((rec) => ({
    x: [rec.punto1[0], rec.punto2[0]],
    y: [rec.punto1[1], rec.punto2[1]],
    type: "scatter",
    mode: "lines",
    line: rec.color,
    name: `recta ${rec.id}`,
  }));

  const layout = {
    xaxis: {
      range: [0, 20],
      title: "x",
      tickvals: Array.from({ length: 21 }, (_, i) => i),
      zeroline: true,
    },
    yaxis: {
      range: [0, 20],
      title: "y",
      tickvals: Array.from({ length: 21 }, (_, i) => i),
      scaleanchor: "x",
      zeroline: true,
    },
    showlegend: true,
    margin: { t: 20, r: 20, l: 20, b: 20 },
  };

  return (
    <div>
      
      <div>
        <Plot data={data} layout={layout} />
      </div>
    </div>
  );
}
