import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Plus,
  AlertTriangle,
  FolderOpen,
  Download,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { GoogleSheetsSyncConfig, Transaction } from '../types';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncConfig: GoogleSheetsSyncConfig;
  isGoogleConnected: boolean;
  userEmail?: string;
  onGoogleSignIn: () => Promise<void>;
  onCreateSpreadsheet: () => Promise<void>;
  onSyncData: () => Promise<void>;
  onToggleAutoSync: () => void;
  onExportCSV: () => void;
  transactionsCount: number;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  syncConfig,
  isGoogleConnected,
  userEmail,
  onGoogleSignIn,
  onCreateSpreadsheet,
  onSyncData,
  onToggleAutoSync,
  onExportCSV,
  transactionsCount,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmSync, setShowConfirmSync] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setIsProcessing(true);
    setStatusMessage('Criando planilha estruturada no Google Drive...');
    try {
      await onCreateSpreadsheet();
      setStatusMessage('Planilha criada com sucesso no seu Google Drive!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage(err.message || 'Erro ao criar planilha.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAndSync = async () => {
    setShowConfirmSync(false);
    setIsProcessing(true);
    setStatusMessage('Sincronizando lançamentos e relatórios no Google Planilhas...');
    try {
      await onSyncData();
      setStatusMessage('Dados sincronizados com sucesso no Google Drive!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage(err.message || 'Erro ao sincronizar.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Sincronização com Google Drive & Planilhas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alimente automaticamente sua planilha do Residencial Jasmim na nuvem
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Message Alert */}
          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
              <span>{statusMessage}</span>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Google Auth Status Card */}
          <div className="p-4 rounded-xl border border-slate-700 bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Conta Google
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isGoogleConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {isGoogleConnected
                      ? `Conectado como ${userEmail || 'Usuário Google'}`
                      : 'Não autenticado no Google'}
                  </span>
                </div>
              </div>

              {!isGoogleConnected ? (
                <button
                  type="button"
                  onClick={onGoogleSignIn}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Conectar com o Google</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>Permissões concedidas</span>
                </div>
              )}
            </div>
          </div>

          {/* Spreadsheet State Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  {syncConfig.spreadsheetTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {syncConfig.spreadsheetId ? (
                    <span>ID: {syncConfig.spreadsheetId.slice(0, 16)}...</span>
                  ) : (
                    <span>Nenhuma planilha criada ainda no seu Drive.</span>
                  )}
                </p>
              </div>

              {syncConfig.spreadsheetUrl && (
                <a
                  href={syncConfig.spreadsheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                >
                  <span>Abrir no Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Sync Status Info */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
              <span>
                Última sincronização:{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {syncConfig.lastSyncedAt
                    ? new Date(syncConfig.lastSyncedAt).toLocaleString('pt-BR')
                    : 'Nunca'}
                </strong>
              </span>
              <span>
                Lançamentos prontos para envio:{' '}
                <strong className="text-slate-800 dark:text-slate-200">{transactionsCount}</strong>
              </span>
            </div>
          </div>

          {/* Sync Actions Bar */}
          <div className="space-y-3">
            {!syncConfig.spreadsheetId ? (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCreate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Planilha "Residencial Jasmim" no Google Drive</span>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setShowConfirmSync(true)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Sincronizar Agora com o Drive</span>
                </button>

                {syncConfig.spreadsheetUrl && (
                  <a
                    href={syncConfig.spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-emerald-400" />
                    <span>Ver no Google Sheets ↗</span>
                  </a>
                )}
              </div>
            )}

            {/* Offline backup fallback */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onExportCSV}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Baixar Backup Offline (Arquivo CSV / Excel)</span>
              </button>
            </div>
          </div>

          {/* Security & Sheet Structure details */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Abas sincronizadas no Google Sheets:
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-300">
              <li><strong>Lançamentos:</strong> Extrato de receitas, despesas, datas e hashes de auditoria.</li>
              <li><strong>Resumo Mensal:</strong> Balanço analítico de superávit / déficit e saldo.</li>
              <li><strong>Unidades e Inadimplência:</strong> Status de pagamento dos 14 apartamentos.</li>
            </ul>
          </div>
        </div>

        {/* User Confirmation Dialog for Workspace API Update (MANDATORY per Workspace Skill) */}
        {showConfirmSync && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-6 z-20">
            <div className="bg-slate-900 p-6 rounded-2xl max-w-sm w-full border border-slate-700 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-500">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Confirmar Atualização da Planilha
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Você deseja sincronizar e atualizar os <strong>{transactionsCount} lançamentos</strong> do Residencial Jasmim na sua planilha do Google Drive? Esta ação atualizará os valores das abas Lançamentos e Resumo Mensal.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSync(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndSync}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer"
                >
                  Sim, Sincronizar Agora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
