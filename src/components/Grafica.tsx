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
  fun_obj: { valor: [number, number] };
  restreccion: restre[];
};

//estructura para guardar los puntos de cada restriccion
type recta = {
  id: number;
  punto1: [number, number];
  punto2: [number, number];
  color: string;
};

export default function Grafica({ restreccion, fun_obj }: lista) {
  // funcion auxiliar para obtener un color aleatorio retorna un string
  const colorAleatorio = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  // hook para que las rectas se grafiquen en el servidor del cliente
  const [intersecciones, setIntersecciones] = useState<recta[]>([]);
  const max = 20;
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
        punto2 = [max, y]; // extendido al rango del layout
      } else if (b === 0) {
        // Recta vertical: x = c/a
        const x = c / a;
        punto1 = [x, 0];
        punto2 = [x, max]; // extendido al rango del layout
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
        color,
      };
    });

    setIntersecciones(puntos);
  }, [restreccion]);

  const [puntosFactibles, setPuntosFactibles] = useState<[number, number][]>(
    []
  );
  const [maximo, setMaximo] = useState<{
    punto: [number, number];
    valor: number;
  } | null>(null);
  const [minimo, setMinimo] = useState<{
    punto: [number, number];
    valor: number;
  } | null>(null);

  // Resolver sistema 2x2
  function resolverSistema2x2(r1: restre, r2: restre): [number, number] | null {
    const [a1, b1, c1] = r1.valor;
    const [a2, b2, c2] = r2.valor;

    const det = a1 * b2 - a2 * b1;
    if (det === 0) return null; // paralelas

    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;

    return [x, y];
  }

  // Generar puntos candidatos
  function generarPuntosCandidatos(restreccion: restre[]): [number, number][] {
    const candidatos: [number, number][] = [];

    for (let i = 0; i < restreccion.length; i++) {
      for (let j = i + 1; j < restreccion.length; j++) {
        const punto = resolverSistema2x2(restreccion[i], restreccion[j]);
        if (punto) candidatos.push(punto);
      }
    }

    for (const r of restreccion) {
      const [a, b, c] = r.valor;
      if (b !== 0) candidatos.push([0, c / b]);
      if (a !== 0) candidatos.push([c / a, 0]);
    }

    return candidatos;
  }

  // Filtrar puntos factibles según restricciones
  function filtrarFactibles(
    puntos: [number, number][],
    restricciones: restre[]
  ): [number, number][] {
    return puntos.filter(([x, y]) =>
      restricciones.every((r) => {
        const [a, b, c] = r.valor;
        if (r.igual === "<=") return a * x + b * y <= c + 1e-9;
        if (r.igual === ">=") return a * x + b * y >= c - 1e-9;
        if (r.igual === "=") return Math.abs(a * x + b * y - c) < 1e-9;
        return false;
      })
    );
  }

  // Evaluar función objetivo en un punto
  function evaluarObjetivo(
    [x, y]: [number, number],
    fun_obj: [number, number]
  ) {
    return fun_obj[0] * x + fun_obj[1] * y;
  }

  // Ejecutar cada vez que cambian las restricciones o función objetivo
  useEffect(() => {
    const candidatos = generarPuntosCandidatos(restreccion);
    const factibles = filtrarFactibles(candidatos, restreccion);
    setPuntosFactibles(factibles);

    // Calcular máximo y mínimo
    if (factibles.length > 0) {
      let max = {
        punto: factibles[0],
        valor: evaluarObjetivo(factibles[0], fun_obj.valor),
      };
      let min = {
        punto: factibles[0],
        valor: evaluarObjetivo(factibles[0], fun_obj.valor),
      };

      for (const p of factibles) {
        const val = evaluarObjetivo(p, fun_obj.valor);
        if (val > max.valor) max = { punto: p, valor: val };
        if (val < min.valor) min = { punto: p, valor: val };
      }

      setMaximo(max);
      setMinimo(min);
    }
  }, [restreccion, fun_obj]);

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
  if (maximo) {
  data.push({
    x: [maximo.punto[0]],
    y: [maximo.punto[1]],
    mode: "markers+text",
    type: "scatter",
    name: "Máximo",
    marker: { color: "red", size: 12, symbol: "star" },
    text: [`Z=${maximo.valor.toFixed(2)}`],
    textposition: "top center"
  } as any);
}

if (minimo) {
  data.push({
    x: [minimo.punto[0]],
    y: [minimo.punto[1]],
    mode: "markers+text",
    type: "scatter",
    name: "Mínimo",
    marker: { color: "green", size: 12, symbol: "star" },
    text: [`Z=${minimo.valor.toFixed(2)}`],
    textposition: "top center"
  } as any);
}
if (puntosFactibles.length > 0) {
  // Ordenar puntos por ángulo polar (para cerrar bien el polígono)
  const centro = puntosFactibles.reduce(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y],
    [0, 0]
  ).map(v => v / puntosFactibles.length) as [number, number];

  const ordenados = [...puntosFactibles].sort((p1, p2) => {
    const ang1 = Math.atan2(p1[1] - centro[1], p1[0] - centro[0]);
    const ang2 = Math.atan2(p2[1] - centro[1], p2[0] - centro[0]);
    return ang1 - ang2;
  });

  // Agregar traza del área factible
  data.push({
    x: ordenados.map(p => p[0]),
    y: ordenados.map(p => p[1]),
    type: "scatter",
    mode: "lines",
    fill: "toself",
    name: "Área Factible",
    fillcolor: "rgba(0,200,100,0.2)",
    line: { color: "green" }
  } as any);
}


  return (
    <div>
      <div>
        <Plot data={data} layout={layout} />
      </div>
      <div className="text-center">
        <h3>Puntos factibles:</h3>
        <ul>
          {puntosFactibles.map(([x, y], i) => (
            <li key={i}>
              ({x.toFixed(2)}, {y.toFixed(2)})
            </li>
          ))}
        </ul>

        {maximo && (
          <p>
            Máximo Z = {maximo.valor.toFixed(2)} en (
            {maximo.punto[0].toFixed(2)}, {maximo.punto[1].toFixed(2)})
          </p>
        )}
        {minimo && (
          <p>
            Mínimo Z = {minimo.valor.toFixed(2)} en (
            {minimo.punto[0].toFixed(2)}, {minimo.punto[1].toFixed(2)})
          </p>
        )}
      </div>
    </div>
  );
}
