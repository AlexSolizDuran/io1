// ==================== HOOK PARA PROGRAMACIÓN LINEAL ====================

import { useState, useEffect } from 'react';
import { Restriccion, FuncionObjetivo, PuntoRecta, PuntoFactible } from '../types/programacion-lineal';
import { 
  calcularPuntosRecta, 
  generarPuntosCandidatos, 
  filtrarPuntosFactibles, 
  calcularExtremos 
} from '../utils/matematicas';

export const useProgramacionLineal = (restricciones: Restriccion[], funcionObjetivo: FuncionObjetivo) => {
  // Estados
  const [intersecciones, setIntersecciones] = useState<PuntoRecta[]>([]);
  const [puntosFactibles, setPuntosFactibles] = useState<[number, number][]>([]);
  const [maximo, setMaximo] = useState<PuntoFactible | null>(null);
  const [minimo, setMinimo] = useState<PuntoFactible | null>(null);

  // Calcular intersecciones de rectas
  useEffect(() => {
    const puntos = restricciones.map(r => calcularPuntosRecta(r));
    setIntersecciones(puntos);
  }, [restricciones]);

  // Calcular puntos factibles y extremos
  useEffect(() => {
    const candidatos = generarPuntosCandidatos(restricciones);
    const factibles = filtrarPuntosFactibles(candidatos, restricciones);
    setPuntosFactibles(factibles);

    const { maximo: max, minimo: min } = calcularExtremos(factibles, funcionObjetivo.valor);
    setMaximo(max);
    setMinimo(min);
  }, [restricciones, funcionObjetivo]);

  return {
    intersecciones,
    puntosFactibles,
    maximo,
    minimo,
  };
};
