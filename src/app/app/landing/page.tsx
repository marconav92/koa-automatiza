import { createServerSupabase } from "@/lib/supabase/server-client";

export default async function LandingPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow p-8 space-y-4">
        <h1 className="text-2xl font-bold">Pantalla de inicio</h1>
        {user ? (
          <>
            <p className="text-gray-700">
              Sesión iniciada como: <strong>{user.email}</strong>
            </p>
            <p className="text-gray-600">
              Desde aquí añadiremos el panel del paciente/profesional.
            </p>
            <form action="/auth/signout" method="post">
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100"
                type="submit"
              >
                Cerrar sesión
              </button>
            </form>
          </>
        ) : (
          <p className="text-gray-700">
            No hay sesión activa. <a href="/login" className="underline">Iniciar sesión</a>
          </p>
        )}
      </div>
    </main>
  );
}
