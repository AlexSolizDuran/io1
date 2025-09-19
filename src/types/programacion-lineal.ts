// ==================== TIPOS PARA PROGRAMACIÓN LINEAL ====================

export type Restriccion = {
  id: number;
  valor: [number, number, number];
  igual: string;
};

export type FuncionObjetivo = {
  valor: [number, number];
};

export type PuntoRecta = {
  id: number;
  punto1: [number, number];
  punto2: [number, number];
  color: string;
};

export type PuntoFactible = {
  punto: [number, number];
  valor: number;
};

export type PropsGrafica = {
  fun_obj: FuncionObjetivo;
  restreccion: Restriccion[];
};

// ==================== OPCIONES ====================
export const OPCIONES_IGUALDAD = [
  { id: 1, valor: "<=", label: "≤" },
  { id: 2, valor: ">=", label: "≥" },
  { id: 3, valor: "=", label: "=" },
] as const;

// ==================== CONSTANTES ====================
export const MAX_RANGE = 20;
export const TOLERANCIA = 1e-9;
