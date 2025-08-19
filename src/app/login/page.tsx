"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Mode = "magic" | "signin" | "signup" | "resetRequest";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("magic");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="max-w-md w-full rounded-2xl shadow">
        <CardContent className="p-8 space-y-6">
          <Header mode={mode} setMode={setMode} />
          {mode === "magic" && <MagicLinkForm />}
          {mode === "signin" && <SignInForm setMode={setMode} />}
          {mode === "signup" && <SignUpForm setMode={setMode} />}
          {mode === "resetRequest" && <ResetRequestForm setMode={setMode} />}
        </CardContent>
      </Card>
    </main>
  );
}

function Header({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">
        {mode === "magic" && "Acceso por enlace (sin contraseña)"}
        {mode === "signin" && "Iniciar sesión (email + contraseña)"}
        {mode === "signup" && "Crear cuenta (email + contraseña)"}
        {mode === "resetRequest" && "Recuperar contraseña"}
      </h1>

      <p className="text-sm text-gray-600">
        Puedes entrar con un enlace seguro o con email y contraseña.
      </p>

      <div className="flex gap-2 pt-2">
        <Button
          variant={mode === "magic" ? "default" : "outline"}
          onClick={() => setMode("magic")}
        >
          Enlace por email
        </Button>
        <Button
          variant={mode === "signin" ? "default" : "outline"}
          onClick={() => setMode("signin")}
        >
          Email + contraseña
        </Button>
      </div>
    </div>
  );
}

function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <form onSubmit={handleSendLink} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email_magic">Correo electrónico</Label>
        <Input
          id="email_magic"
          type="email"
          placeholder="tu-correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={status === "sending" || !email}>
        {status === "sending" ? "Enviando..." : "Enviar enlace de acceso"}
      </Button>

      {status === "sent" && (
        <p className="text-sm text-green-700">
          Enlace enviado. Revisa tu correo y haz clic para iniciar sesión.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">
          Error: {error ?? "No se pudo enviar el enlace"}
        </p>
      )}
    </form>
  );
}

function SignInForm({ setMode }: { setMode: (m: Mode) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      // Redirige a la landing
      window.location.href = "/app/landing";
    }
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email_signin">Correo electrónico</Label>
        <Input
          id="email_signin"
          type="email"
          placeholder="tu-correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_signin">Contraseña</Label>
        <Input
          id="password_signin"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Button type="submit" disabled={status === "sending" || !email || !password}>
          Entrar
        </Button>
        <button
          type="button"
          className="text-sm underline"
          onClick={() => setMode("resetRequest")}
        >
          ¿Has olvidado la contraseña?
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">Error: {error}</p>
      )}

      <p className="text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <button type="button" className="underline" onClick={() => setMode("signup")}>
          Crear cuenta
        </button>
      </p>
    </form>
  );
}

function SignUpForm({ setMode }: { setMode: (m: Mode) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      // Si has dejado "Confirm email = OFF" en desarrollo, la sesión entra directa
      window.location.href = "/app/landing";
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email_signup">Correo electrónico</Label>
        <Input
          id="email_signup"
          type="email"
          placeholder="tu-correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_signup">Contraseña</Label>
        <Input
          id="password_signup"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Button type="submit" disabled={status === "sending" || !email || !password}>
          Crear cuenta
        </Button>
        <button type="button" className="text-sm underline" onClick={() => setMode("signin")}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">Error: {error}</p>
      )}
    </form>
  );
}

function ResetRequestForm({ setMode }: { setMode: (m: Mode) => void }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/update-password`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <form onSubmit={handleReset} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email_reset">Correo electrónico</Label>
        <Input
          id="email_reset"
          type="email"
          placeholder="tu-correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={status === "sending" || !email}>
        {status === "sending" ? "Enviando..." : "Enviar enlace de recuperación"}
      </Button>

      {status === "sent" && (
        <p className="text-sm text-green-700">
          Te hemos enviado un enlace para actualizar tu contraseña.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">Error: {error}</p>
      )}

      <p className="text-sm text-gray-600">
        ¿La recuerdas?{" "}
        <button type="button" className="underline" onClick={() => setMode("signin")}>
          Volver a iniciar sesión
        </button>
      </p>
    </form>
  );
}