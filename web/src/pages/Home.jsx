import { Button } from "@/components/ui/button";
import { useHealth } from "@/api/health";

export default function Home() {
  const { data, loading, error, fetchHealth } = useHealth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 text-center">
      <h1 className="text-3xl font-bold">MERN Stack Package</h1>
      <p className="text-xl">
        A full-stack MERN package developed by Yashraj Singh Solanki.
      </p>
      <Button
        className="mt-6 cursor-pointer"
        variant="secondary"
        size="lg"
        onClick={fetchHealth}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check API Status"}
      </Button>

      {data && (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 px-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">Response from Server:</span>
          </div>
          <p className="text-zinc-200">{data.message}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/40 p-3 px-5 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}