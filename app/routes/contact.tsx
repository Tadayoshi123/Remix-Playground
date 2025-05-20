import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const message = formData.get("message");

  // Appel à l'API Strapi
  const res = await fetch("http://localhost:1337/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Ajoute le token d'admin si besoin
      // "Authorization": "Bearer VOTRE_TOKEN"
    },
    body: JSON.stringify({
      data: { message }
    }),
  });

  if (!res.ok) {
    return json({ error: "Erreur lors de l'envoi du message" }, { status: 400 });
  }

  return redirect("/contact?success=1");
};

export default function Contact() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl w-full max-w-xs border border-white/20 flex flex-col items-center">
        <h1 className="text-xl font-bold text-white mb-4 text-center">Contactez-nous</h1>
        <Form method="post" className="w-full flex flex-col gap-3">
          <textarea
            name="message"
            required
            className="rounded-md p-2 bg-gray-900/80 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition resize-none min-h-[60px] text-sm"
            placeholder="Votre message..."
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all text-sm"
          >
            Envoyer
          </button>
        </Form>
        {actionData && "error" in actionData && actionData.error && (
          <p className="mt-3 text-red-400 text-center text-sm font-medium">{actionData.error}</p>
        )}
        {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("success") && (
          <p className="mt-3 text-green-400 text-center text-sm font-medium">
            Merci pour votre message !
          </p>
        )}
      </div>
    </div>
  );
}
