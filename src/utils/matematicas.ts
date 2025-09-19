// ==================== FUNCIONES MATEMÁTICAS ====================

import { Restriccion, PuntoRecta, MAX_RANGE, TOLERANCIA } from '../types/programacion-lineal';

/**
 * Genera un color aleatorio en formato hexadecimal
 */
export const generarColorAleatorio = (): string => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
};

/**
 * Calcula los puntos de una recta para graficar
 */
export const calcularPuntosRecta = (restriccion: Restriccion, max: number = MAX_RANGE): PuntoRecta => {
  const [a, b, c] = restriccion.valor;
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
    punto2 = [max, y];
  } else if (b === 0) {
    // Recta vertical: x = c/a
    const x = c / a;
    punto1 = [x, 0];
    punto2 = [x, max];
  } else {
    // Caso general
    punto1 = [c / a, 0]; // intersección con eje X
    punto2 = [0, c / b]; // intersección con eje Y
  }

  return {
    id: restriccion.id,
    punto1,
    punto2,
    color: generarColorAleatorio(),
  };
};

/**
 * Resuelve un sistema de ecuaciones 2x2
 */
export const resolverSistema2x2 = (r1: Restriccion, r2: Restriccion): [number, number] | null => {
  const [a1, b1, c1] = r1.valor;
  const [a2, b2, c2] = r2.valor;

  const det = a1 * b2 - a2 * b1;
  if (det === 0) return null; // paralelas

  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;

  return [x, y];
};

/**
 * Evalúa la función objetivo en un punto dado
 */
export const evaluarFuncionObjetivo = ([x, y]: [number, number], fun_obj: [number, number]): number => {
  return fun_obj[0] * x + fun_obj[1] * y;
};

/**
 * Verifica si un punto cumple todas las restricciones
 */
export const esPuntoFactible = ([x, y]: [number, number], restricciones: Restriccion[]): boolean => {
  return restricciones.every((r) => {
    const [a, b, c] = r.valor;
    if (r.igual === "<=") return a * x + b * y <= c + TOLERANCIA;
    if (r.igual === ">=") return a * x + b * y >= c - TOLERANCIA;
    if (r.igual === "=") return Math.abs(a * x + b * y - c) < TOLERANCIA;
    return false;
  });
};

/**
 * Genera puntos candidatos para el algoritmo de programación lineal
 */
export const generarPuntosCandidatos = (restricciones: Restriccion[]): [number, number][] => {
  const candidatos: [number, number][] = [];

  // Intersecciones entre restricciones
  for (let i = 0; i < restricciones.length; i++) {
    for (let j = i + 1; j < restricciones.length; j++) {
      const punto = resolverSistema2x2(restricciones[i], restricciones[j]);
      if (punto) candidatos.push(punto);
    }
  }

  // Intersecciones con ejes
  for (const r of restricciones) {
    const [a, b, c] = r.valor;
    if (b !== 0) candidatos.push([0, c / b]);
    if (a !== 0) candidatos.push([c / a, 0]);
  }

  return candidatos;
};

/**
 * Filtra puntos que cumplen todas las restricciones
 */
export const filtrarPuntosFactibles = (
  puntos: [number, number][],
  restricciones: Restriccion[]
): [number, number][] => {
  return puntos.filter(punto => esPuntoFactible(punto, restricciones));
};

/**
 * Calcula los puntos de máximo y mínimo de la función objetivo
 */
export const calcularExtremos = (
  puntos: [number, number][],
  funcionObjetivo: [number, number]
): { maximo: { punto: [number, number]; valor: number } | null; minimo: { punto: [number, number]; valor: number } | null } => {
  if (puntos.length === 0) return { maximo: null, minimo: null };

  let maximo = {
    punto: puntos[0],
    valor: evaluarFuncionObjetivo(puntos[0], funcionObjetivo),
  };
  let minimo = {
    punto: puntos[0],
    valor: evaluarFuncionObjetivo(puntos[0], funcionObjetivo),
  };

  for (const punto of puntos) {
    const valor = evaluarFuncionObjetivo(punto, funcionObjetivo);
    if (valor > maximo.valor) maximo = { punto, valor };
    if (valor < minimo.valor) minimo = { punto, valor };
  }

  return { maximo, minimo };
};
