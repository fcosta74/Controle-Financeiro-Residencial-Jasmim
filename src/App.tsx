/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import {
  Building2,
  PlusCircle,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Bell,
  TrendingDown,
  TrendingUp,
  LayoutDashboard,
  ListFilter,
  CheckCircle,
} from 'lucide-react';
import {
  CondoUnit,
  GoogleSheetsSyncConfig,
  MonthlyBalance,
  PaymentMethod,
  PushNotificationItem,
  Transaction,
  TransactionType,
  UserRole,
} from './types';
import { INITIAL_CONDO_UNITS, INITIAL_TRANSACTIONS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TransactionsList } from './components/TransactionsList';
import { TransactionModal } from './components/TransactionModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { CondoUnitsModal } from './components/CondoUnitsModal';
import { AuditCryptoModal } from './components/AuditCryptoModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import {
  googleSignIn,
  initAuth,
  logout,
  getAccessToken,
} from './services/firebaseAuth';
import {
  createCondoSpreadsheet,
  downloadTransactionsCSV,
  syncDataToSpreadsheet,
} from './services/googleSheets';
import {
  playChimeSound,
  sendNativePushNotification,
} from './services/notifications';
import { generateTransactionHash } from './services/crypto';

export default function App() {
  // Roles & User State
  const [currentRole, setCurrentRole] = useState<UserRole>('sindico');
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  // App Data (Loaded from LocalStorage or seeded defaults)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('jasmim_transactions_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [condoUnits, setCondoUnits] = useState<CondoUnit[]>(() => {
    const saved = localStorage.getItem('jasmim_units_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 14) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return INITIAL_CONDO_UNITS;
  });

  const [syncConfig, setSyncConfig] = useState<GoogleSheetsSyncConfig>(() => {
    const saved = localStorage.getItem('jasmim_sync_config_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      spreadsheetId: null,
      spreadsheetUrl: null,
      spreadsheetTitle: 'Residencial Jasmim - Controle Financeiro 2026',
      lastSyncedAt: null,
      autoSync: true,
      status: 'idle',
    };
  });

  const [notifications, setNotifications] = useState<PushNotificationItem[]>(() => {
    const saved = localStorage.getItem('jasmim_notifications_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'notif-1',
        title: 'Sistema Inicializado',
        body: 'Bem-vindo ao Controle Financeiro do Residencial Jasmim. Criptografia SHA-256 ativa.',
        timestamp: new Date().toISOString(),
        type: 'system',
        read: false,
      },
    ];
  });

  // UI state
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>('dashboard');

  // Modals state
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState<TransactionType>('despesa');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [cryptoInspectorTx, setCryptoInspectorTx] = useState<Transaction | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Quick Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('jasmim_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('jasmim_units_v2', JSON.stringify(condoUnits));
  }, [condoUnits]);

  useEffect(() => {
    localStorage.setItem('jasmim_sync_config_v1', JSON.stringify(syncConfig));
  }, [syncConfig]);

  useEffect(() => {
    localStorage.setItem('jasmim_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Compute monthly balances across available months
  const monthlyBalances = useMemo<MonthlyBalance[]>(() => {
    const months = ['2026-07', '2026-08', '2026-09', '2026-10'];
    const monthLabels: Record<string, string> = {
      '2026-07': 'Jul/2026',
      '2026-08': 'Ago/2026',
      '2026-09': 'Set/2026',
      '2026-10': 'Out/2026',
    };

    return months.map((mKey) => {
      const monthTxs = transactions.filter((t) => t.date.startsWith(mKey));
      const income = monthTxs
        .filter((t) => t.type === 'receita')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTxs
        .filter((t) => t.type === 'despesa')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        monthKey: mKey,
        month: monthLabels[mKey] || mKey,
        income,
        expense,
        balance: income - expense,
      };
    });
  }, [transactions]);

  // Dispatch new Push Notification helper
  const addNotification = (
    title: string,
    body: string,
    type: 'receita' | 'despesa' | 'sync' | 'audit' | 'system'
  ) => {
    const newNotif: PushNotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      body,
      timestamp: new Date().toISOString(),
      type,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (soundEnabled) {
      if (type === 'receita') playChimeSound('receita');
      else if (type === 'despesa') playChimeSound('despesa');
      else playChimeSound('sync');
    }

    sendNativePushNotification(title, body);
  };

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleAccessToken(result.accessToken);
        showToast('Autenticado com sucesso na conta Google!');
        addNotification(
          'Google Workspace Conectado',
          `Conexão estabelecida com ${result.user.email} para sincronização com Drive.`,
          'sync'
        );
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      showToast('Falha no login com Google: ' + (err.message || 'Erro desconhecido'));
    }
  };

  // Create Google Spreadsheet in Drive
  const handleCreateSpreadsheet = async () => {
    const res = await createCondoSpreadsheet('Residencial Jasmim - Controle Financeiro 2026');
    setSyncConfig((prev) => ({
      ...prev,
      spreadsheetId: res.spreadsheetId,
      spreadsheetUrl: res.spreadsheetUrl,
      lastSyncedAt: new Date().toISOString(),
      status: 'success',
    }));

    // Perform initial synchronization
    await syncDataToSpreadsheet(
      res.spreadsheetId,
      transactions,
      monthlyBalances,
      condoUnits
    );

    showToast('Planilha criada e sincronizada com sucesso no seu Google Drive!');
    addNotification(
      'Planilha Criada no Google Drive',
      'Nova planilha "Residencial Jasmim" configurada com abas de Lançamentos, Resumo e Unidades.',
      'sync'
    );
  };

  // Sync Data to Google Sheets
  const handleSyncData = async () => {
    if (!syncConfig.spreadsheetId) {
      throw new Error('Nenhuma planilha configurada.');
    }

    await syncDataToSpreadsheet(
      syncConfig.spreadsheetId,
      transactions,
      monthlyBalances,
      condoUnits
    );

    const now = new Date().toISOString();
    setSyncConfig((prev) => ({
      ...prev,
      lastSyncedAt: now,
      status: 'success',
    }));

    showToast('Dados sincronizados com sucesso na planilha do Google Drive!');
    addNotification(
      'Sincronização Concluída',
      `Todos os ${transactions.length} lançamentos e balanços foram sincronizados no Google Planilhas.`,
      'sync'
    );
  };

  // Save Transaction (Add or Edit)
  const handleSaveTransaction = async (tx: Transaction) => {
    let updated: Transaction[];
    const isEdit = transactions.some((t) => t.id === tx.id);

    if (isEdit) {
      updated = transactions.map((t) => (t.id === tx.id ? tx : t));
      showToast('Lançamento atualizado e criptografado com sucesso!');
      addNotification(
        'Lançamento Atualizado',
        `${tx.type === 'receita' ? 'Receita' : 'Despesa'} "${tx.description}" alterada (R$ ${tx.amount.toFixed(2)}).`,
        tx.type
      );
    } else {
      updated = [tx, ...transactions];
      showToast(`Novo lançamento de ${tx.type} registrado com sucesso!`);
      addNotification(
        tx.type === 'receita' ? 'Nova Receita Registrada' : 'Nova Despesa Registrada',
        `${tx.description} no valor de R$ ${tx.amount.toFixed(2)} (${tx.recipientOrUnit}).`,
        tx.type
      );
    }

    setTransactions(updated);

    // Auto sync to Google Sheets if spreadsheet is connected
    if (syncConfig.spreadsheetId && syncConfig.autoSync) {
      try {
        const token = await getAccessToken();
        if (token) {
          syncDataToSpreadsheet(syncConfig.spreadsheetId, updated, monthlyBalances, condoUnits)
            .then(() => {
              setSyncConfig((prev) => ({ ...prev, lastSyncedAt: new Date().toISOString() }));
            })
            .catch((err) => console.warn('Auto-sync error:', err));
        }
      } catch (err) {
        console.warn('Auto-sync background error:', err);
      }
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    const confirmDelete = window.confirm(
      `Deseja realmente excluir o lançamento "${tx.description}" de R$ ${tx.amount.toFixed(2)}? Esta ação não pode ser desfeita.`
    );
    if (!confirmDelete) return;

    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    showToast('Lançamento excluído com sucesso.');
    addNotification('Lançamento Excluído', `O registro "${tx.description}" foi removido do livro-caixa.`, 'system');
  };

  // Toggle Council Audit Verification
  const handleToggleCouncilAudit = (tx: Transaction) => {
    const willVerify = !tx.verifiedByCouncil;
    const now = new Date().toISOString().split('T')[0];
    const auditorName = currentRole === 'sindico' ? 'Síndico Fábio' : 'Conselho Fiscal';

    const updated = transactions.map((t) => {
      if (t.id === tx.id) {
        return {
          ...t,
          verifiedByCouncil: willVerify,
          verifiedAt: willVerify ? now : undefined,
          verifiedBy: willVerify ? auditorName : undefined,
        };
      }
      return t;
    });

    setTransactions(updated);
    showToast(willVerify ? 'Lançamento auditado e aprovado com sucesso!' : 'Auditoria revogada.');
    addNotification(
      willVerify ? 'Auditoria Aprovada' : 'Auditoria Revogada',
      `${auditorName} ${willVerify ? 'aprovou' : 'revogou'} a conformidade do lançamento "${tx.description}".`,
      'audit'
    );
  };

  // Register payment for a condo unit
  const handleRegisterUnitPayment = async (unit: CondoUnit) => {
    const today = new Date().toISOString().split('T')[0];
    const txBase: Omit<Transaction, 'cryptoHash'> = {
      id: 'tx-unit-' + unit.unitNumber + '-' + Date.now(),
      type: 'receita',
      category: 'Cota Condominial Ordinária',
      description: `Pagamento Cota Condominial Apt ${unit.unitNumber} (${unit.block})`,
      amount: unit.monthlyFee,
      date: today,
      paymentMethod: 'pix',
      recipientOrUnit: `Apt ${unit.unitNumber} - ${unit.residentName}`,
      status: 'pago',
      verifiedByCouncil: true,
      verifiedAt: today,
      verifiedBy: 'Síndico Geral (Baixa Direta)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const cryptoHash = await generateTransactionHash(txBase);
    const newTx: Transaction = { ...txBase, cryptoHash };

    // Update unit status to adimplente
    setCondoUnits((prev) =>
      prev.map((u) =>
        u.id === unit.id ? { ...u, status: 'adimplente', lastPaymentDate: today } : u
      )
    );

    // Save transaction
    handleSaveTransaction(newTx);
    showToast(`Baixa da cota do Apt ${unit.unitNumber} realizada com sucesso!`);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        syncConfig={syncConfig}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenCryptoModal={() => {
          setCryptoInspectorTx(null);
          setIsCryptoModalOpen(true);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotifsCount}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isGoogleConnected={!!googleAccessToken}
        userEmail={googleUser?.email || undefined}
      />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Tabs (Mobile & Desktop View Switcher) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Painel Geral & Gráficos</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListFilter className="w-4 h-4 text-teal-400" />
              <span>Livro-Caixa ({transactions.length})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Atualização em Tempo Real</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 pb-24 md:pb-8">
        {activeTab === 'dashboard' ? (
          <Dashboard
            currentRole={currentRole}
            transactions={transactions}
            condoUnits={condoUnits}
            monthlyBalances={monthlyBalances}
            selectedMonth={selectedMonth}
            onChangeMonth={setSelectedMonth}
            onOpenNewTransaction={(type) => {
              setEditingTransaction(null);
              setTransactionModalType(type);
              setIsTransactionModalOpen(true);
            }}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onOpenUnitsModal={() => setIsUnitsModalOpen(true)}
            onOpenCryptoModal={() => {
              setCryptoInspectorTx(null);
              setIsCryptoModalOpen(true);
            }}
          />
        ) : (
          <TransactionsList
            currentRole={currentRole}
            transactions={transactions}
            onEditTransaction={(tx) => {
              setEditingTransaction(tx);
              setIsTransactionModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
            onToggleCouncilAudit={handleToggleCouncilAudit}
            onViewCryptoProof={(tx) => {
              setCryptoInspectorTx(tx);
              setIsCryptoModalOpen(true);
            }}
            onExportCSV={() => downloadTransactionsCSV(transactions)}
          />
        )}
      </main>

      {/* Mobile Sticky Quick Action Bar (Bottom Navigation for Smartphones) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-4 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold cursor-pointer ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Painel</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold cursor-pointer ${
            activeTab === 'transactions' ? 'text-teal-400' : 'text-slate-400'
          }`}
        >
          <ListFilter className="w-5 h-5" />
          <span>Lançamentos</span>
        </button>

        {currentRole === 'sindico' && (
          <button
            onClick={() => {
              setEditingTransaction(null);
              setTransactionModalType('despesa');
              setIsTransactionModalOpen(true);
            }}
            className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95"
            title="Novo Lançamento Rápido"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={() => setIsUnitsModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white cursor-pointer"
        >
          <Users className="w-5 h-5" />
          <span>14 Aptos</span>
        </button>

        <button
          onClick={() => setIsSyncModalOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-white cursor-pointer"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span>Planilha</span>
        </button>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialType={transactionModalType}
        editingTransaction={editingTransaction}
      />

      <GoogleSheetsSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncConfig={syncConfig}
        isGoogleConnected={!!googleAccessToken}
        userEmail={googleUser?.email || undefined}
        onGoogleSignIn={handleGoogleSignIn}
        onCreateSpreadsheet={handleCreateSpreadsheet}
        onSyncData={handleSyncData}
        onToggleAutoSync={() =>
          setSyncConfig((prev) => ({ ...prev, autoSync: !prev.autoSync }))
        }
        onExportCSV={() => downloadTransactionsCSV(transactions)}
        transactionsCount={transactions.length}
      />

      <CondoUnitsModal
        isOpen={isUnitsModalOpen}
        onClose={() => setIsUnitsModalOpen(false)}
        units={condoUnits}
        currentRole={currentRole}
        onRegisterUnitPayment={handleRegisterUnitPayment}
      />

      <AuditCryptoModal
        isOpen={isCryptoModalOpen}
        onClose={() => setIsCryptoModalOpen(false)}
        transactions={transactions}
        selectedTransaction={cryptoInspectorTx}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />
    </div>
  );
}
