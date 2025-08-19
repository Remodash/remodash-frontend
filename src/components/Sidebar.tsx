"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Home, Settings, ClipboardList, ClipboardCheck, Construction } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar() {
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
        <h1 className="text-xl font-bold">Remodash</h1>
        <p className="text-sm">Gestion des EDL</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/ga/dashboard" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/ga/dashboard") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/ga/dashboard")}
            >
              <Home size={18} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/ga/edl-entrant" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/ga/edl-entrant") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/ga/edl-entrant")}
            >
              <ClipboardList size={18} />
              EDL entrant
            </Link>
          </li>
          <li>
            <Link 
              href="/ga/pre-edl" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/ga/pre-edl") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/ga/pre-edl")}
            >
              <FileText size={18} />
              Pre-EDL
            </Link>
          </li>
          <li>
            <Link 
              href="/ga/edl-sortant" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/ga/edl-sortant") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/ga/edl-sortant")}
            >
              <ClipboardCheck size={18} />
              EDL sortant
            </Link>
          </li>
          <li>
            <Link 
              href="/ga/travaux" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/ga/travaux") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/ga/travaux")}
            >
              <Construction size={18} />
              Travaux
            </Link>
          </li>
          <li>
            <Link 
              href="/ga/parametres" 
              className={`flex items-center gap-3 p-3 rounded transition-colors ${isActive("/ga/parametres") ? "bg-background/20 font-medium" : "hover:bg-background/10"}`}
              onClick={() => handleItemClick("/ga/parametres")}
            >
              <Settings size={18} />
              Paramètres
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 text-sm text-background/70">
        © 2025 Remodash
      </div>
    </div>
  );
}