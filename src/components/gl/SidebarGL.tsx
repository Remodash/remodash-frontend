"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Settings,  
  Users,
  Building,
  Mail,
  Bell
} from "lucide-react";
import { useState, useEffect } from "react";

export default function SidebarGL() {
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
        <h1 className="text-xl font-bold">Remodash GL</h1>
        <p className="text-sm">Gestionnaire Locative</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard/gl" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/dashboard/gl") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/dashboard/gl")}
            >
              <Home size={18} />
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/gl/locataires" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gl/locataires") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gl/locataires")}
            >
              <Users size={18} />
              Locataires
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/gl/logements" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gl/logements") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gl/logements")}
            >
              <Building size={18} />
              Logements
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/gl/courriers" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gl/courriers") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gl/courriers")}
            >
              <Mail size={18} />
              Courriers de congé
            </Link>
          </li>
          <li>
            <Link 
              href="/pages/gl/notifications" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gl/notifications") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gl/notifications")}
            >
              <Bell size={18} />
              Notifications
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-background/20">
            <Link 
              href="/pages/gl/parametres" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gl/parametres") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gl/parametres")}
            >
              <Settings size={18} />
              Paramètres
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 text-sm text-background/70">
        © 2025 Remodash - by Nyamsi Ruben
      </div>
    </div>
  );
}