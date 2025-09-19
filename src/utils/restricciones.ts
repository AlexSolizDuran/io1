// ==================== UTILIDADES PARA GESTIÓN DE RESTRICCIONES ====================

import { Restriccion, FuncionObjetivo } from '../types/programacion-lineal';

/**
 * Crea una nueva restricción con valores por defecto
 */
export const crearNuevaRestriccion = (restricciones: Restriccion[]): Restriccion => {
  const nuevoId = restricciones.length > 0 
    ? Math.max(...restricciones.map((r) => r.id)) + 1 
    : 1;
  
  return { 
    id: nuevoId, 
    valor: [1, 1, 1], 
    igual: ">=" 
  };
};

/**
 * Agrega una nueva restricción a la lista
 */
export const agregarRestriccion = (
  restricciones: Restriccion[], 
  setRestricciones: (restricciones: Restriccion[]) => void
) => {
  const nuevaRestriccion = crearNuevaRestriccion(restricciones);
  setRestricciones([...restricciones, nuevaRestriccion]);
};

/**
 * Elimina una restricción de la lista
 */
export const eliminarRestriccion = (
  id: number,
  restricciones: Restriccion[], 
  setRestricciones: (restricciones: Restriccion[]) => void
) => {
  setRestricciones(restricciones.filter((r) => r.id !== id));
};

/**
 * Actualiza un coeficiente de una restricción
 */
export const actualizarCoeficiente = (
  id: number,
  indice: number,
  nuevoValor: number,
  restricciones: Restriccion[], 
  setRestricciones: (restricciones: Restriccion[]) => void
) => {
  setRestricciones(
    restricciones.map((r) =>
      r.id === id
        ? {
            ...r,
            valor: r.valor.map((v, i) => (i === indice ? nuevoValor : v)) as [number, number, number],
          }
        : r
    )
  );
};

/**
 * Actualiza el tipo de igualdad de una restricción
 */
export const actualizarIgualdad = (
  id: number,
  nuevaIgualdad: string,
  restricciones: Restriccion[], 
  setRestricciones: (restricciones: Restriccion[]) => void
) => {
  setRestricciones(
    restricciones.map((r) => (r.id === id ? { ...r, igual: nuevaIgualdad } : r))
  );
};

/**
 * Actualiza un coeficiente de la función objetivo
 */
export const actualizarFuncionObjetivo = (
  indice: number,
  nuevoValor: number,
  funcionObjetivo: FuncionObjetivo,
  setFuncionObjetivo: (funcionObjetivo: FuncionObjetivo) => void
) => {
  setFuncionObjetivo({
    ...funcionObjetivo,
    valor: funcionObjetivo.valor.map((v, i) => (i === indice ? nuevoValor : v)) as [number, number],
  });
};
