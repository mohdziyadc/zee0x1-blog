import { createFileRoute } from "@tanstack/react-router";
import { ConstructionIcon } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center -mt-[4.5rem]">
      <main className="container mx-auto px-4 py-8 max-w-6xl w-full">
        <div className="flex items-center justify-center text-center">
          <div className="mr-2 text-3xl">🛠️</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              Under Construction
            </span>
          </h1>
        </div>
      </main>
    </div>
  );
}
