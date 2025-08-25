// components/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import SidebarGL from "./gl/SidebarGL";
import SidebarGT from "./gt/SidebarGT";
import AdminSidebar from "./admin/sidebarAdmin";

// Définition des chemins qui ne doivent pas afficher de sidebar
const NO_SIDEBAR_PATHS = ["/login", "/", "/register", "/password-reset"];

// Définition des chemins qui utilisent le sidebar GL
const GL_PATHS = [
  "/dashboard/gl",
  "/pages/gl/locataires",
  "/pages/gl/logements",
  "/pages/gl/courriers",
  "/pages/gl/parametres",
  "/pages/gl/notifications"
];

// Définition des chemins qui utilisent le sidebar GT
const GT_PATHS = [
  "/dashboard/gt",
  "/pages/gt/logements",
  "/pages/gt/diagnostics",
  "/pages/gt/travaux",
  //"/pages/gt/validations",
  "/pages/gt/edl",
  //"/pages/gt/rapports",
  "/pages/gt/parametres"
];

const ADMIN_PATHS = [
  "/dashboard/admin",
];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Vérifier si on doit afficher un sidebar
  const shouldShowSidebar = !NO_SIDEBAR_PATHS.some(path => pathname === path);
  
  // Vérifier quel sidebar utiliser en fonction du chemin
  let SidebarComponent = Sidebar; // Sidebar par défaut
  
  if (GL_PATHS.some(path => pathname.startsWith(path))) {
    SidebarComponent = SidebarGL;
  } else if (GT_PATHS.some(path => pathname.startsWith(path))) {
    SidebarComponent = SidebarGT;
  } else if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    SidebarComponent = AdminSidebar;
  }
  
  // Si on ne doit pas afficher de sidebar, retourner simplement le contenu
  if (!shouldShowSidebar) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex">
      <SidebarComponent />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}