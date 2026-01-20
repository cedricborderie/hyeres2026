import { debugEnvironmentVariables } from "@/app/actions/debug-env";

export default async function DebugPage() {
  const env = await debugEnvironmentVariables();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug Environment Variables</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(env, null, 2)}
        </pre>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Interprétation :</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>hasServiceRoleKey:</strong>{" "}
            {env.hasServiceRoleKey ? (
              <span className="text-green-600">✅ OUI - Variable chargée</span>
            ) : (
              <span className="text-red-600">❌ NON - Variable non chargée</span>
            )}
          </li>
          <li>
            <strong>hasSupabaseUrl:</strong>{" "}
            {env.hasSupabaseUrl ? (
              <span className="text-green-600">✅ OUI</span>
            ) : (
              <span className="text-red-600">❌ NON</span>
            )}
          </li>
          <li>
            <strong>hasAnonKey:</strong>{" "}
            {env.hasAnonKey ? (
              <span className="text-green-600">✅ OUI</span>
            ) : (
              <span className="text-red-600">❌ NON</span>
            )}
          </li>
        </ul>
      </div>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          <strong>Note :</strong> Cette page est uniquement pour le debug. Supprimez-la en production.
        </p>
      </div>
    </div>
  );
}
