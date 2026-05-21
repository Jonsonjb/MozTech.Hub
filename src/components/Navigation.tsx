/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserSession } from '../types';
import { 
  LayoutGrid, 
  Home, 
  Wrench, 
  BookOpen, 
  LogIn, 
  LogOut, 
  Shield,
  FileText,
  Compass,
  Award,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

export type ActiveTabType = 'Netek' | 'KayaMoz' | 'FixMoz' | 'CVBuilder' | 'HousePlans' | 'Blog' | 'Tutorials' | 'Locations' | 'Admin' | 'Documents';

interface NavigationProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  currentUser: UserSession | null;
  onLogin: (user: UserSession) => void;
  onLogout: () => void;
  onOpenLoginModal: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenLoginModal
}: NavigationProps) {
  const tabs = [
    { id: 'Netek' as const, label: 'NETEK', icon: LayoutGrid, desc: 'Classificados & Tech' },
    { id: 'KayaMoz' as const, label: 'KAYAMOZ', icon: Home, desc: 'Imobiliário' },
    { id: 'FixMoz' as const, label: 'FIXMOZ', icon: Wrench, desc: 'Serviços' },
    { id: 'CVBuilder' as const, label: 'CV & CARTA', icon: FileText, desc: 'Gerador IA' },
    { id: 'HousePlans' as const, label: 'PLANTAS', icon: Compass, desc: 'Projetos Casas' },
    { id: 'Tutorials' as const, label: 'TUTORIAIS', icon: Award, desc: 'jonsonjb' },
    { id: 'Documents' as const, label: 'DOCUMENTOS', icon: FileText, desc: 'Pré-Marcações' },
    { id: 'Blog' as const, label: 'BLOG JB', icon: BookOpen, desc: 'Reflexões' },
    { id: 'Locations' as const, label: 'CONTACTOS', icon: MapPin, desc: 'WhatsApp & Map' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:py-5">
        
        {/* Logo and Brand Title with Bold Typography Theme style */}
        <div className="flex items-center space-x-3 select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-gold-500 font-display text-xl font-black text-black shadow-lg">
            M
          </div>
          <div>
            <h1 className="font-display font-black text-xl tracking-tight text-white uppercase sm:text-2xl leading-none">
              MOZ TECH HUB <span className="text-gold-500 font-bold text-xs select-none">V2.0</span>
            </h1>
            <p className="font-mono text-[9px] font-bold tracking-widest text-zinc-500 uppercase mt-1">
              ECOSSISTEMA INTEGRADO DE MOÇAMBIQUE
            </p>
          </div>
        </div>

        {/* Tab Switchers (Desktop and Large screens) with Bold Outline/Border aesthetic */}
        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto max-w-2xl xl:max-w-3xl py-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-1.5 rounded-xs px-3 py-1.5 font-display text-[11px] font-bold tracking-wider transition-all duration-155 uppercase whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-gold-500 font-extrabold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-xs bg-zinc-900 border border-zinc-800"
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  />
                )}
                <IconComponent className="relative z-10 h-3.5 w-3.5" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}

          {/* Admin Tab (Visual styling matching the rest, with Gold highlight) */}
          <button
            onClick={() => setActiveTab('Admin')}
            className={`relative flex items-center space-x-1.5 rounded-xs px-3 py-1.5 font-display text-[11px] font-bold tracking-wider transition-all duration-155 uppercase whitespace-nowrap cursor-pointer ${
              activeTab === 'Admin'
                ? 'text-amber-500 font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {activeTab === 'Admin' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 rounded-xs bg-zinc-900 border border-amber-500/40"
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
              />
            )}
            <Shield className="relative z-10 h-3.5 w-3.5" />
            <span className="relative z-10">ADMIN</span>
            {currentUser?.role === 'admin' && (
              <span className="relative z-10 flex h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Right Actions: User Profile / Login with Bold Gold visual block */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3 rounded-xs bg-zinc-900/90 p-1.5 pr-3 border border-zinc-800 shadow-md">
              <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-gold-500 font-bold text-black text-xs uppercase select-none">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-display text-xs font-bold text-white uppercase leading-none">{currentUser.name}</p>
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#22C55E] font-bold block leading-none mt-1 select-none">
                  STATUS: {currentUser.role === 'admin' ? 'ADMIN' : 'USUÁRIO'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sair da Conta"
                className="text-zinc-400 hover:text-red-500 p-1 rounded-sm hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="group flex items-center space-x-2 rounded-sm bg-gold-500 hover:bg-gold-600 text-black font-display px-4 py-2 bg-gradient-to-r text-xs font-extrabold tracking-widest uppercase shadow-md transition-all cursor-pointer active:scale-97"
            >
              <LogIn className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              <span>ENTRAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sticky Navigation Rail with horizontal scroll UX for modular comfort */}
      <div className="lg:hidden border-t border-zinc-800 bg-neutral-950 flex overflow-x-auto whitespace-nowrap scrollbar-none px-2 py-1.5 gap-2 select-none">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xs transition-all duration-205 flex-shrink-0 ${
                isActive ? 'text-gold-500 bg-zinc-900 border border-zinc-800 font-bold' : 'text-zinc-500 hover:text-zinc-350 bg-zinc-950 text-xs'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="font-display text-[9.5px] font-bold tracking-wider uppercase">{tab.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={() => setActiveTab('Admin')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xs transition-all duration-205 flex-shrink-0 ${
            activeTab === 'Admin' ? 'text-amber-500 bg-zinc-900 border border-amber-950/50 font-bold' : 'text-zinc-500 hover:text-zinc-350 bg-zinc-950 text-xs'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span className="font-display text-[9.5px] font-bold tracking-wider uppercase">ADMIN</span>
        </button>
      </div>
    </header>
  );
}
