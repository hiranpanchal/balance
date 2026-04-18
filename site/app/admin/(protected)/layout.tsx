import { AdminNav } from "@/components/admin/AdminNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F0E6] flex">
      <AdminNav />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-10 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
