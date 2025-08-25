"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  Users, 
  Settings, 
  Home, 
  BarChart3, 
  Building, 
  FileText,
  ClipboardList
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>("");

  // Synchroniser l'élément actif avec la route actuelle
  useEffect(() => {
    setActiveItem(pathname || "");
  }, [pathname]);

  const handleItemClick = (path: string) => {
    setActiveItem(path);
  };

  // Fonction pour déterminer si un élément est actif
  const isActive = (path: string): boolean => {
    return activeItem === path;
  };

  return (
    <div className="w-64 h-screen bg-accent text-background p-4 flex flex-col">
      <div className="mb-8 p-4 border-b border-background/20">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield size={24} />
          Admin Panel
        </h1>
        <p className="text-sm">Gestion complète du système</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard/admin" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/dashboard/admin") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/dashboard/admin")}
            >
              <Home size={18} />
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/admin/utilisateurs" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/admin/utilisateurs") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/admin/utilisateurs")}
            >
              <Users size={18} />
              Utilisateurs
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/admin/roles" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/admin/roles") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/admin/roles")}
            >
              <Shield size={18} />
              Rôles & Permissions
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/admin/patrimoine" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/admin/patrimoine") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/admin/patrimoine")}
            >
              <Building size={18} />
              Patrimoine
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/admin/statistiques" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/admin/statistiques") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/admin/statistiques")}
            >
              <BarChart3 size={18} />
              Statistiques
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/admin/audit" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/admin/audit") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/admin/audit")}
            >
              <ClipboardList size={18} />
              Journal d&apos;audit
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/admin/rapports" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/admin/rapports") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/admin/rapports")}
            >
              <FileText size={18} />
              Rapports
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-background/20">
            <Link 
              href="/pages/admin/parametres" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/admin/parametres") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/admin/parametres")}
            >
              <Settings size={18} />
              Paramètres système
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 text-sm text-background/70">
        © 2025 Remodash - Admin System
      </div>
    </div>
  );
}