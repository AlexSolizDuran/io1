"use client";
import dynamic from "next/dynamic";
import { PropsGrafica } from '../types/programacion-lineal';
import { useProgramacionLineal } from '../hooks/useProgramacionLineal';
import { 
  generarDatosRectas, 
  generarDatosExtremos, 
  generarDatosAreaFactible, 
  generarLayout 
} from '../utils/plotly-utils';

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// ==================== COMPONENTE PRINCIPAL ====================
export default function Grafica({ restreccion, fun_obj }: PropsGrafica) {
  // Usar el hook personalizado para la lógica de programación lineal
  const { intersecciones, puntosFactibles, maximo, minimo } = useProgramacionLineal(restreccion, fun_obj);

  // ==================== DATOS PARA EL PLOT ====================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [
    ...generarDatosRectas(intersecciones),
    ...generarDatosExtremos(maximo, minimo),
    ...generarDatosAreaFactible(puntosFactibles),
  ];

  const layout = generarLayout();


  // ==================== RENDERIZADO ====================
  return (
    <div>
      {/* Gráfica */}
      <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', marginBottom: '20px' }}>
        <Plot data={data} layout={layout} />
      </div>

      {/* Información de resultados */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Puntos Factibles</h3>
        <div style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {puntosFactibles.map(([x, y], i) => (
              <li key={i} style={{ fontSize: '14px', marginBottom: '4px' }}>
                ({x.toFixed(2)}, {y.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>

        {/* Resultados de optimización */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {maximo && (
            <div style={{ backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', padding: '10px' }}>
              <h4 style={{ fontWeight: 'bold', color: '#c62828', marginBottom: '5px' }}>Máximo</h4>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Z = {maximo.valor.toFixed(2)}<br/>
                ({maximo.punto[0].toFixed(2)}, {maximo.punto[1].toFixed(2)})
              </p>
            </div>
          )}
          
          {minimo && (
            <div style={{ backgroundColor: '#e8f5e8', border: '1px solid #4CAF50', borderRadius: '4px', padding: '10px' }}>
              <h4 style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '5px' }}>Mínimo</h4>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Z = {minimo.valor.toFixed(2)}<br/>
                ({minimo.punto[0].toFixed(2)}, {minimo.punto[1].toFixed(2)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
