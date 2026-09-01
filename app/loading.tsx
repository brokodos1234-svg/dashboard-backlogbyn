import LoadingState from "@/components/LoadingState";

export default function Loading() {
  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <LoadingState />
      </div>
    </div>
  );
}
