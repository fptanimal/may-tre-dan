import { useLang } from '../context/LanguageContext';
import React, { useState } from 'react';
import { 
  Menu, X, Home, Info, Globe, Map, GraduationCap, 
  HeartHandshake, ShoppingBag, Headset, BookOpen, 
  CreditCard, Trophy, ChevronRight, ShieldAlert 
} from 'lucide-react';

export default function SidebarNavigation() {
    const { text: localize } = useLang();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Sanctuary', icon: Home, active: true },
    { name: 'About', icon: Info },
    { name: 'Global Ranks', icon: Globe },
    { name: 'Atlas', icon: Map },
    { name: 'Academy', icon: GraduationCap },
    { name: 'Contribute', icon: HeartHandshake },
    { name: 'Shop', icon: ShoppingBag },
    { name: 'VR Discovery', icon: Headset, badge: 'BETA' },
    { name: 'Tutorial', icon: BookOpen },
    { name: 'Admin Dashboard', icon: ShieldAlert, href: '/admin', badge: 'ADMIN' },
    { name: 'Subscription / Plans', icon: CreditCard, badge: 'PLUS' },
  ];

  return (
    <>
      {/* Hamburger Toggle - visible only on small screens */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-[#0f0f11] text-gray-300 border border-white/10 hover:text-white lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-72 bg-[#0f0f11] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ease-in-out font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>

        {/* 1. User Profile */}
        <div className="flex items-center gap-3 p-6 border-b border-white/5 mt-8 lg:mt-0">
          <div className="w-11 h-11 rounded-full border border-gray-700 bg-gray-800 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-300 font-semibold text-sm tracking-widest">{localize("TH")}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-yellow-500 font-semibold leading-tight text-sm">{localize("The Archivist")}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5 font-bold">{localize("Imperial Scholar")}</span>
          </div>
        </div>

        {/* 2. Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <a
                key={index}
                href={item.href || '#'}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-emerald-900/40 text-emerald-400' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gray-300 transition-colors'} />
                  <span className="text-sm font-medium">{localize(item.name)}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-900/50 bg-[#0f0f11] text-emerald-400 tracking-wider shadow-sm">
                    {localize(item.badge)}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        {/* 3. CTA Button */}
        <div className="p-4 border-t border-white/5 pb-8 lg:pb-4">
          <button className="w-full flex items-center justify-between px-5 py-3 rounded-full border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300 group">
            <Trophy size={18} />
            <span className="font-bold text-sm tracking-wide">{localize("NÂNG CẤP")}</span>
            <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </aside>
    </>
  );
}
