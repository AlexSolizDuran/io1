"use client";
import { useState } from "react";
import Grafica from "./Grafica";
import { Restriccion, FuncionObjetivo, OPCIONES_IGUALDAD } from '../types/programacion-lineal';
import { 
  agregarRestriccion as agregarRestriccionUtil,
  eliminarRestriccion as eliminarRestriccionUtil,
  actualizarCoeficiente as actualizarCoeficienteUtil,
  actualizarIgualdad as actualizarIgualdadUtil,
  actualizarFuncionObjetivo as actualizarFuncionObjetivoUtil
} from '../utils/restricciones';

// ==================== COMPONENTE PRINCIPAL ====================
export default function ProgLineal() {
  // Estados
  const [restricciones, setRestricciones] = useState<Restriccion[]>([]);
  const [funcionObjetivo, setFuncionObjetivo] = useState<FuncionObjetivo>({ valor: [1, 1] });

  // ==================== FUNCIONES DE GESTIÓN ====================
  const agregarRestriccion = () => {
    agregarRestriccionUtil(restricciones, setRestricciones);
  };

  const eliminarRestriccion = (id: number) => {
    eliminarRestriccionUtil(id, restricciones, setRestricciones);
  };

  const actualizarCoeficiente = (id: number, indice: number, nuevoValor: number) => {
    actualizarCoeficienteUtil(id, indice, nuevoValor, restricciones, setRestricciones);
  };

  const actualizarIgualdad = (id: number, nuevaIgualdad: string) => {
    actualizarIgualdadUtil(id, nuevaIgualdad, restricciones, setRestricciones);
  };

  const actualizarFuncionObjetivo = (indice: number, nuevoValor: number) => {
    actualizarFuncionObjetivoUtil(indice, nuevoValor, funcionObjetivo, setFuncionObjetivo);
  };

  // ==================== RENDERIZADO ====================
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          Programación Lineal
        </h1>
        <p style={{ color: '#666' }}>
          Resuelve problemas de optimización con restricciones lineales
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Panel de entrada */}
        <div>
          {/* Función objetivo */}
          <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', padding: '20px', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>
              Función Objetivo
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Z =</span>
              <input
                type="number"
                value={funcionObjetivo.valor[0]}
                onChange={(e) => actualizarFuncionObjetivo(0, Number(e.target.value))}
                style={{ width: '60px', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                placeholder="a"
              />
              <span>x₁ +</span>
              <input
                type="number"
                value={funcionObjetivo.valor[1]}
                onChange={(e) => actualizarFuncionObjetivo(1, Number(e.target.value))}
                style={{ width: '60px', padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                placeholder="b"
              />
              <span>x₂</span>
            </div>
          </div>

          {/* Restricciones */}
          <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontWeight: 'bold' }}>
                Restricciones
              </h2>
              <button
                onClick={agregarRestriccion}
                style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                + Agregar
              </button>
            </div>

            <div>
              {restricciones.map((restriccion) => (
                <div key={restriccion.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}>
                  <input
                    type="number"
                    value={restriccion.valor[0]}
                    onChange={(e) => actualizarCoeficiente(restriccion.id, 0, Number(e.target.value))}
                    style={{ width: '50px', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="a"
                  />
                  <span>x₁ +</span>
                  <input
                    type="number"
                    value={restriccion.valor[1]}
                    onChange={(e) => actualizarCoeficiente(restriccion.id, 1, Number(e.target.value))}
                    style={{ width: '50px', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="b"
                  />
                  <span>x₂</span>
                  <select
                    value={restriccion.igual}
                    onChange={(e) => actualizarIgualdad(restriccion.id, e.target.value)}
                    style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    {OPCIONES_IGUALDAD.map((op) => (
                      <option key={op.id} value={op.valor}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={restriccion.valor[2]}
                    onChange={(e) => actualizarCoeficiente(restriccion.id, 2, Number(e.target.value))}
                    style={{ width: '50px', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                    placeholder="c"
                  />
                  <button
                    onClick={() => eliminarRestriccion(restriccion.id)}
                    style={{ padding: '4px 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {restricciones.length === 0 && (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                  No hay restricciones. Haz clic en &quot;Agregar&quot; para comenzar.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Gráfica */}
        <div>
          <Grafica restreccion={restricciones} fun_obj={funcionObjetivo} />
        </div>
      </div>
    </div>
  );
}
