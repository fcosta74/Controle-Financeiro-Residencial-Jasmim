import React from 'react';
import {
  Building2,
  ShieldCheck,
  Bell,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  UserCheck,
  ChevronDown,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UserRole, GoogleSheetsSyncConfig } from '../types';
import buildingLogo from '../assets/images/jasmim_building_logo_1793191822353.jpg';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  syncConfig: GoogleSheetsSyncConfig;
  onOpenSyncModal: () => void;
  onOpenCryptoModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isGoogleConnected: boolean;
  userEmail?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  syncConfig,
  onOpenSyncModal,
  onOpenCryptoModal,
  onOpenNotifications,
  unreadNotificationsCount,
  soundEnabled,
  onToggleSound,
  isGoogleConnected,
  userEmail,
}) => {
  const roleLabels: Record<UserRole, { label: string; badge: string; desc: string }> = {
    sindico: {
      label: 'Síndico Geral',
      badge: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700',
      desc: 'Acesso total (Edição, Lançamentos, Sincronização)',
    },
    conselho: {
      label: 'Conselho Fiscal',
      badge: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-700',
      desc: 'Auditoria, Validação de Comprovantes, Relatórios',
    },
    condomino: {
      label: 'Condômino / Morador',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700',
      desc: 'Portal de Transparência e Balancetes Mensais',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Condo Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-md shrink-0 flex items-center justify-center">
              <img
                src={buildingLogo}
                alt="Logo Residencial Jasmim"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">Residencial Jasmim</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  Tempo Real
                </span>
              </div>
              <p className="text-[11px] text-slate-400">14 Aptos • Banco Itaú</p>
            </div>
          </div>

          {/* Center / Right utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Google Sheets Sync Pill (Desktop/Tablet) */}
            <button
              onClick={onOpenSyncModal}
              title="Sincronização com Google Planilhas no Drive"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                syncConfig.spreadsheetId
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">
                {syncConfig.spreadsheetId ? 'Planilha Drive Conectada' : 'Conectar Planilha Drive'}
              </span>
              <span className="md:hidden">Drive</span>
              {syncConfig.spreadsheetId && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Cryptography Badge (Desktop/Tablet) */}
            <button
              onClick={onOpenCryptoModal}
              title="Criptografia de Ponta a Ponta Ativa (SHA-256)"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-teal-300 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span className="text-xs">SHA-256</span>
            </button>

            {/* Sound Chime Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Silenciar avisos sonoros' : 'Ativar avisos sonoros'}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Push Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notificações Push de Novos Lançamentos"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-none">
                    Perfil
                  </div>
                  <select
                    value={currentRole}
                    onChange={(e) => onChangeRole(e.target.value as UserRole)}
                    className="text-xs font-semibold text-slate-100 bg-transparent border-0 focus:ring-0 cursor-pointer p-0 pr-4 leading-tight"
                  >
                    <option value="sindico" className="bg-slate-900 text-white">Síndico Geral (Gestão)</option>
                    <option value="conselho" className="bg-slate-900 text-white">Conselho Fiscal (Auditoria)</option>
                    <option value="condomino" className="bg-slate-900 text-white">Condômino (Transparência)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
