"use client";
import { useState } from "react";
import Grafica from "./Grafica";
//estructura de una restriccion
type recta = {
  id: number;
  valor: [number, number, number];
  igual: string;
};
export default function ProgLineal() {
  const igualdades = [
    { id: 1, igual: "<=" },
    { id: 2, igual: ">=" },
    { id: 3, igual: "=" },
  ];
  //lista de restricciones
  const [rectas, setRectas] = useState<recta[]>([]);
  //este es para agregar una nueva restriccion
  const agregar = () => {
    const nuevoId =
      rectas.length > 0 ? Math.max(...rectas.map((r) => r.id)) + 1 : 0;
    const nuevo: recta = { id: nuevoId, valor: [1, 1, 1], igual: ">=" };
    setRectas([...rectas, nuevo]);
  };
  // quitar alguna restriccion
  const quitar = (id: Number) => {
    setRectas(rectas.filter((rec) => rec.id !== id));
  };
  //actualizar los parametros de las rectas
  const actualizar = (id: number, index: number, nuevoValor: number) => {
    setRectas(
      rectas.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              valor: rec.valor.map((v, i) =>
                i === index ? nuevoValor : v
              ) as [number, number, number],
            }
          : rec
      )
    );
  };
  //actualizar la igualdad de la restriccion
  const actualizarIgual = (id: number, nuevoIgual: string) => {
    setRectas(
      rectas.map((rec) => (rec.id === id ? { ...rec, igual: nuevoIgual } : rec))
    );
  };
  return (
    <div>
      <div>
        <h1 className=" text-red-600 ">esta es una prueba</h1>
        <button onClick={agregar} className="p-2 bg-green-500 rounded">
          agregar
        </button>
        {rectas.map((recta) => (
          <div key={recta.id}>
            <input
              type="number"
              value={recta.valor[0]}
              onChange={(e) => actualizar(recta.id, 0, Number(e.target.value))}
            />
            <input
              type="number"
              value={recta.valor[1]}
              onChange={(e) => actualizar(recta.id, 1, Number(e.target.value))}
            />
            <select
              value={recta.igual}
              onChange={(e) => actualizarIgual(recta.id, e.target.value)}
            >
              {igualdades.map((op) => (
                <option key={op.id} value={op.igual}>
                  {" "}
                  {op.igual}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={recta.valor[2]}
              onChange={(e) => actualizar(recta.id, 2, Number(e.target.value))}
            />
            <button
              onClick={() => quitar(recta.id)}
              className=" p-2 bg-red-500"
            >
              eliminar
            </button>
          </div>
        ))}
      </div>
      <div>
        <Grafica restreccion={rectas}></Grafica>
      </div>
    </div>
  );
}
