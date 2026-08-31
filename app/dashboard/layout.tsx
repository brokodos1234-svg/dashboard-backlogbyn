import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="fixed inset-y-0 left-0 hidden lg:block">
        <Sidebar />
      </div>
      <div className="w-full lg:pl-64">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
