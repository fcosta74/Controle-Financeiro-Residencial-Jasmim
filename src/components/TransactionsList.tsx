import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  FileText,
  CreditCard,
  Building,
  Download,
} from 'lucide-react';
import { Transaction, TransactionType, UserRole } from '../types';
import { formatCryptoHash } from '../services/crypto';

interface TransactionsListProps {
  currentRole: UserRole;
  transactions: Transaction[];
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onToggleCouncilAudit: (tx: Transaction) => void;
  onViewCryptoProof: (tx: Transaction) => void;
  onExportCSV: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  currentRole,
  transactions,
  onEditTransaction,
  onDeleteTransaction,
  onToggleCouncilAudit,
  onViewCryptoProof,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [auditFilter, setAuditFilter] = useState<string>('all');

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Filter logic
  const filtered = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    if (auditFilter === 'verified' && !tx.verifiedByCouncil) return false;
    if (auditFilter === 'pending_audit' && tx.verifiedByCouncil) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchDesc = tx.description.toLowerCase().includes(q);
      const matchCat = tx.category.toLowerCase().includes(q);
      const matchRec = tx.recipientOrUnit.toLowerCase().includes(q);
      const matchHash = tx.cryptoHash.toLowerCase().includes(q);
      return matchDesc || matchCat || matchRec || matchHash;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
      {/* Header & Filters */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Livro-Caixa e Lançamentos em Tempo Real
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filtered.length} registro(s) encontrado(s) • Totalmente auditável
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-650 transition-colors cursor-pointer"
              title="Baixar planilha CSV local para conferência offline"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar favorecido, descrição, categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('receita')}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'receita'
                  ? 'bg-emerald-500 text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setTypeFilter('despesa')}
              className={`flex-1 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'despesa'
                  ? 'bg-rose-500 text-white shadow-xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
              }`}
            >
              Despesas
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Status: Todos</option>
            <option value="pago">Status: Pago / Concluído</option>
            <option value="pendente">Status: Pendente</option>
            <option value="agendado">Status: Agendado</option>
          </select>

          {/* Council Audit Filter */}
          <select
            value={auditFilter}
            onChange={(e) => setAuditFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Auditoria: Todas</option>
            <option value="verified">Auditados pelo Conselho ✓</option>
            <option value="pending_audit">Aguardando Auditoria ⌛</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2 stroke-1" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">Nenhum lançamento encontrado</p>
          <p className="text-xs mt-1 text-slate-400">Tente ajustar os filtros ou a busca acima.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {filtered.map((tx) => {
            const isIncome = tx.type === 'receita';

            return (
              <div
                key={tx.id}
                className="p-4 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {tx.description}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        }`}
                      >
                        {tx.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>Data: {formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {tx.recipientOrUnit}
                      </span>
                      <span>•</span>
                      <span className="uppercase text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {tx.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Value, Security Stamp & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700/50">
                  {/* Amount */}
                  <div className="text-right">
                    <div
                      className={`text-base sm:text-lg font-extrabold tracking-tight ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatBRL(tx.amount)}
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          tx.status === 'pago'
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {tx.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Council Audit Toggle / Badge */}
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => onToggleCouncilAudit(tx)}
                      disabled={currentRole === 'condomino'}
                      title={
                        currentRole === 'condomino'
                          ? 'Somente Síndicos e Conselho Fiscal podem validar auditoria'
                          : tx.verifiedByCouncil
                          ? 'Clique para revogar carimbo de auditoria'
                          : 'Clique para auditar e aprovar comprovante deste lançamento'
                      }
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        tx.verifiedByCouncil
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-transparent'
                      } ${currentRole !== 'condomino' ? 'cursor-pointer hover:scale-102' : 'cursor-default opacity-85'}`}
                    >
                      {tx.verifiedByCouncil ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>Auditado</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Pendente</span>
                        </>
                      )}
                    </button>
                    {tx.verifiedBy && (
                      <span className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[100px]">
                        {tx.verifiedBy}
                      </span>
                    )}
                  </div>

                  {/* Crypto Fingerprint button */}
                  <button
                    onClick={() => onViewCryptoProof(tx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={`Assinatura Criptográfica SHA-256: ${tx.cryptoHash}`}
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-500" />
                  </button>

                  {/* Actions for Síndico */}
                  {currentRole === 'sindico' && (
                    <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Editar lançamento"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Excluir lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
