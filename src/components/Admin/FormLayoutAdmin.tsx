import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Users, Menu, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type AdminView = "dashboard" | "pdf" | "dossiers" | "users";

interface NavItem {
  view: AdminView;
  label: string;
  icon: React.FC<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { view: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { view: "pdf", label: "Études NRJ", icon: FolderOpen },
  { view: "dossiers", label: "Dossiers de liaison", icon: ArrowRightLeft },
  { view: "users", label: "Utilisateurs", icon: Users },
];

// ─── Sidebar inner nav ──────────────────────────────────────────────────────────

interface SidebarNavProps {
  current: AdminView;
  onChange: (v: AdminView) => void;
  onBack: () => void;
  navItems: NavItem[];
  title: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ current, onChange, onBack, navItems, title }) => (
  <nav className="flex flex-col h-full">
    <div className="px-6 py-5 border-b border-border">
      <img src="./images/Logo-HER-WEB.webp" alt="" />
      <h2 className="mt-4 text-center text-lg font-bold text-foreground">{title}</h2>
    </div>

    <ul className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ view, label, icon: Icon }) => {
        const isActive = current === view;
        return (
          <li key={view}>
            <button
              onClick={() => onChange(view)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/70" />
              )}
            </button>
          </li>
        );
      })}
    </ul>

    <div className="px-4 pb-4">
      <button
        onClick={onBack}
        className="w-full text-xs text-muted-foreground hover:text-primary text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors"
      >
        ← Retour Espace Commercial
      </button>
    </div>
  </nav>
);

// ─── FormLayoutAdmin ────────────────────────────────────────────────────────────

interface FormLayoutAdminProps {
  children: React.ReactNode;
  currentView: AdminView;
  onViewChange: (v: AdminView) => void;
  navItems?: NavItem[];
  title?: string;
}

const FormLayoutAdmin: React.FC<FormLayoutAdminProps> = ({
  children,
  currentView,
  onViewChange,
  navItems = NAV_ITEMS,
  title = "Espace admin",
}) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (v: AdminView) => {
    onViewChange(v);
    setMobileOpen(false);
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="flex w-full h-screen bg-background overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-card h-screen sticky top-0">
        <SidebarNav current={currentView} onChange={handleNav} onBack={handleBack} navItems={navItems} title={title} />
      </aside>

      {/* ── Mobile header + drawer ── */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarNav current={currentView} onChange={handleNav} onBack={handleBack} />
            </SheetContent>
          </Sheet>
          <span className="font-bold text-foreground">Espace admin</span>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FormLayoutAdmin;
