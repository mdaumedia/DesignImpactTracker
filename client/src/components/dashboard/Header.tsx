import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Menu, Notifications, HelpOutline } from "@/lib/icons";

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <button 
              className="md:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu />
            </button>
            <h1 className="ml-2 text-lg font-display font-semibold text-slate-800 md:hidden">Design Impact</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative rounded-md shadow-sm max-w-xs hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 text-sm">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </span>
              </div>
              <Input 
                type="text" 
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2" 
                placeholder="Search metrics..." 
              />
            </div>
            
            <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-600">
              <Notifications />
            </button>
            
            <button className="p-1.5 rounded-full text-slate-400 hover:text-slate-600">
              <HelpOutline />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
