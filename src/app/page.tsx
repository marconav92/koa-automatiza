import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="max-w-2xl w-full rounded-2xl shadow">
        <CardContent className="p-8 space-y-4">
          <h1 className="text-3xl font-bold">
            KOA Automatiza — Prescripción de ejercicio para artrosis de rodilla
          </h1>

          <p className="text-gray-600">
            Prototipo MVP. En las próximas iteraciones añadiremos autenticación,
            catálogo de ejercicios basado en evidencia y generación automática de programas.
          </p>

          <div className="pt-2">
            <a
              href="/login"
              className="inline-block rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-100"
            >
              Entrar
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Nota: Datos alojados en la UE. Este prototipo no sustituye el juicio clínico.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
