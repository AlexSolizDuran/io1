"use client";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white">Proyecto de Investigación Operativa I</h3>
          <p className="text-sm">Materia: IO1</p>
          <p className="text-sm">Facultad de Ingenieria en Ciencias de la Computación y Telecomunicaciones</p>
        </div>

        
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <h4 className="text-sm font-semibold text-white">Integrantes:</h4>
          <ul className="text-sm">
            <li> Perez Sandoval Wendy Nicol</li>
            <li> Torrez Soto Christian</li>
            <li> Soliz Duran Alex</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-500">
        © 2-2025 Grupo de IO1 — Todos los derechos reservados
      </div>
    </footer>
  );
}
