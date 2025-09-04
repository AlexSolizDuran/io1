"use client";
import { useState } from "react";
import Grafica from "./Grafica";
//estructura de una restriccion
type recta = {
  id: number;
  valor: [number, number, number];
  igual: string;
};
type fun_obj = {
  valor: [number, number];
};
export default function ProgLineal() {
  const igualdades = [
    { id: 1, igual: "<=" },
    { id: 2, igual: ">=" },
    { id: 3, igual: "=" },
  ];
  //lista de restricciones
  const [rectas, setRectas] = useState<recta[]>([]);
  const [zeta, setZeta] = useState<fun_obj>({ valor: [1, 1] });
  //este es para agregar una nueva restriccion
  const agregar = () => {
    const nuevoId =
      rectas.length > 0 ? Math.max(...rectas.map((r) => r.id)) + 1 : 0;
    const nuevo: recta = { id: nuevoId, valor: [1, 1, 1], igual: ">=" };
    setRectas([...rectas, nuevo]);
  };
  // quitar alguna restriccion
  const quitar = (id: number) => {
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
        <div>
          <label> Z = </label>
          <input
            type="number"
            value={zeta.valor[0]}
            onChange={(e) =>
              setZeta({
                ...zeta,
                valor: [Number(e.target.value), zeta.valor[1]],
              })
            }
          />
          <label> x1 + </label>
          <input
            type="number"
            value={zeta.valor[1]}
            onChange={(e) =>
              setZeta({
                ...zeta,
                valor: [zeta.valor[0], Number(e.target.value)],
              })
            }
          />
          <label > x2 </label>
        </div>

        <button onClick={agregar} className="p-2 bg-green-500 rounded">
          agregar
        </button>
        {rectas.map((recta) => (
          <div key={recta.id} className="m-2">
            <input
              type="number"
              value={recta.valor[0]}
              onChange={(e) => actualizar(recta.id, 0, Number(e.target.value))}
              
            />
            <label> x1 + </label>
            <input
              type="number"
              value={recta.valor[1]}
              onChange={(e) => actualizar(recta.id, 1, Number(e.target.value))}
              
            />
            <label> x2 </label>
            <select
              value={recta.igual}
              onChange={(e) => actualizarIgual(recta.id, e.target.value)}
              className="mx-2 border border-black"
            >
              {igualdades.map((op) => (
                <option key={op.id} value={op.igual} className="">
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
              className=" p-2 bg-red-500 rounded"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
      <div>
        <Grafica restreccion={rectas} fun_obj={zeta}></Grafica>
      </div>
    </div>
  );
}
