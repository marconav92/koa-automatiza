"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "updating" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setStatus("updating");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }

    setStatus("done");
    // Una vez actualizada, redirigimos a la landing
    window.location.href = "/app/landing";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="max-w-md w-full rounded-2xl shadow">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-2xl font-bold">Actualizar contraseña</h1>
          <p className="text-sm text-gray-600">
            Introduce tu nueva contraseña para completar la recuperación.
          </p>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password_new">Nueva contraseña</Label>
              <Input
                id="password_new"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={status === "updating" || !password}>
              {status === "updating" ? "Guardando..." : "Guardar y entrar"}
            </Button>
          </form>

          {status === "error" && (
            <p className="text-sm text-red-700">Error: {error}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}