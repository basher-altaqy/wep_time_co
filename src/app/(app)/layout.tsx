import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6">
        <div className="container-app text-sm text-ink-subtle">
          © {new Date().getFullYear()} صَفّ
        </div>
      </footer>
    </div>
  );
}
