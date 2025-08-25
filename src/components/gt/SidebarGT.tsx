"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Settings,
  Construction,
  FileText,
  CheckSquare,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";

export default function SidebarGT() {
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
        <h1 className="text-xl font-bold">Remodash GT</h1>
        <p className="text-sm">Gestionnaire Technique</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/dashboard/gt" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/dashboard/gt") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/dashboard/gt")}
            >
              <Home size={18} />
              Tableau de bord
            </Link>
          </li>
          
          <li>
            <Link 
              href="/pages/gt/logements" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gt/logements") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gt/logements")}
            >
              <CheckSquare size={18} />
              Logements
              <span className="ml-auto bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/pages/gt/edl" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gt/edl") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gt/edl")}
            >
              <AlertTriangle size={18} />
              Etats de lieux
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/pages/gt/diagnostics" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gt/diagnostics") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gt/diagnostics")}
            >
              <FileText size={18} />
              Diagnostics
              <span className="ml-auto bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/pages/gt/travaux" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gt/travaux") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gt/travaux")}
            >
              <Construction size={18} />
              Travaux
              <span className="ml-auto bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                5
              </span>
            </Link>
          </li>
          
          
          <li className="pt-4 mt-4 border-t border-background/20">
            <Link 
              href="/pages/gt/parametres" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/pages/gt/parametres") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/pages/gt/parametres")}
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