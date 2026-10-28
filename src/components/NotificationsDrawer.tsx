import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  ShieldCheck,
  Smartphone,
  Volume2,
  Trash2,
} from 'lucide-react';
import { PushNotificationItem } from '../types';
import { requestNotificationPermission } from '../services/notifications';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotificationItem[];
  onClearNotifications: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearNotifications,
  onMarkAllAsRead,
}) => {
  const [browserPermission, setBrowserPermission] = useState<string>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, [isOpen]);

  const handleRequestNativePush = async () => {
    const res = await requestNotificationPermission();
    setBrowserPermission(res);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-850 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700 animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                Central de Notificações Push
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Avisos em tempo real de novos lançamentos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Activation Banner */}
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-800/40">
          <div className="flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs flex-1">
              <div className="font-bold text-slate-900 dark:text-white">
                Notificações Nativas no Celular / PC
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                Receba alertas instantâneos sempre que um síndico cadastrar uma despesa ou receita.
              </p>
              {browserPermission === 'granted' ? (
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Notificações push do navegador ativas!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestNativePush}
                  className="mt-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Ativar Notificações Push
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action sub-bar */}
        <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.length} notificação(ões)</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllAsRead}
              className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-semibold cursor-pointer"
            >
              Marcar como lidas
            </button>
            <button
              onClick={onClearNotifications}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2 stroke-1" />
              <p className="text-xs font-semibold">Nenhuma notificação recente</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Novos lançamentos e atualizações de planilha aparecerão aqui.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const getIcon = () => {
                switch (item.type) {
                  case 'receita':
                    return <TrendingUp className="w-4 h-4 text-emerald-500" />;
                  case 'despesa':
                    return <TrendingDown className="w-4 h-4 text-rose-500" />;
                  case 'sync':
                    return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
                  case 'audit':
                    return <ShieldCheck className="w-4 h-4 text-blue-500" />;
                  default:
                    return <Bell className="w-4 h-4 text-slate-400" />;
                }
              };

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl transition-colors flex items-start gap-3 ${
                    item.read
                      ? 'bg-transparent'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
