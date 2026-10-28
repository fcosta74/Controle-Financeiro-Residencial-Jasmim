import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  PlusCircle,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from 'lucide-react';
import { CondoUnit, MonthlyBalance, Transaction, UserRole } from '../types';

interface DashboardProps {
  currentRole: UserRole;
  transactions: Transaction[];
  condoUnits: CondoUnit[];
  monthlyBalances: MonthlyBalance[];
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
  onOpenNewTransaction: (type: 'despesa' | 'receita') => void;
  onOpenSyncModal: () => void;
  onOpenUnitsModal: () => void;
  onOpenCryptoModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentRole,
  transactions,
  condoUnits,
  monthlyBalances,
  selectedMonth,
  onChangeMonth,
  onOpenNewTransaction,
  onOpenSyncModal,
  onOpenUnitsModal,
  onOpenCryptoModal,
}) => {
  // Format currency BRL
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  // Calculations for all time
  const totalIncomeAll = transactions
    .filter((t) => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenseAll = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalanceAll = totalIncomeAll - totalExpenseAll;

  // Selected Month calculations
  const monthTransactions = transactions.filter((t) =>
    t.date.startsWith(selectedMonth)
  );

  const monthIncome = monthTransactions
    .filter((t) => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthExpense = monthTransactions
    .filter((t) => t.type === 'despesa')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthNet = monthIncome - monthExpense;

  // Reserve fund (recolhimentos)
  const reserveFundTotal = transactions
    .filter(
      (t) =>
        t.type === 'receita' &&
        t.category.toLowerCase().includes('reserva')
    )
    .reduce((acc, t) => acc + t.amount, 0);

  // Inadimplência stats
  const totalUnits = condoUnits.length;
  const delinquentUnits = condoUnits.filter((u) => u.status === 'atrasado').length;
  const pendingUnits = condoUnits.filter((u) => u.status === 'pendente').length;
  const paidUnits = condoUnits.filter((u) => u.status === 'adimplente').length;
  const complianceRate = totalUnits > 0 ? (paidUnits / totalUnits) * 100 : 100;

  // Category breakdown for expenses in selected month (or fallback all)
  const expenseSource = monthTransactions.filter((t) => t.type === 'despesa');
  const expensesToUse = expenseSource.length > 0 ? expenseSource : transactions.filter((t) => t.type === 'despesa');

  const expenseByCategory: Record<string, number> = {};
  expensesToUse.forEach((t) => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  });

  const sortedCategories = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalAnalyzedExpense = sortedCategories.reduce((acc, curr) => acc + curr[1], 0) || 1;

  // Available months from transactions
  const availableMonths = [
    { key: '2026-10', label: 'Outubro / 2026' },
    { key: '2026-09', label: 'Setembro / 2026' },
    { key: '2026-08', label: 'Agosto / 2026' },
    { key: '2026-07', label: 'Julho / 2026' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-slate-700/80 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex flex-wrap items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Residencial Jasmim • 14 Unidades</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-300 font-semibold">Banco Itaú</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Painel Financeiro & Demonstrativo
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Controle em tempo real de receitas, despesas (Embasa, Coelba, manutenções) e fundo de reserva,
              com sincronização no Google Drive.
            </p>
          </div>

          {/* Quick Actions (Síndico / Conselho) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {currentRole === 'sindico' ? (
              <>
                <button
                  onClick={() => onOpenNewTransaction('receita')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-700/30 transition-all active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Nova Receita</span>
                </button>
                <button
                  onClick={() => onOpenNewTransaction('despesa')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-rose-700/30 transition-all active:scale-95 cursor-pointer"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>+ Nova Despesa</span>
                </button>
              </>
            ) : (
              <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>
                  Visualizando no modo:{' '}
                  <strong className="text-white">
                    {currentRole === 'conselho' ? 'Conselho Fiscal (Auditoria)' : 'Condômino (Morador)'}
                  </strong>
                </span>
              </div>
            )}

            <button
              onClick={onOpenSyncModal}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-medium text-sm text-slate-100 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Planilha Google</span>
            </button>

            <button
              onClick={onOpenUnitsModal}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-medium text-sm text-slate-100 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>14 Aptos</span>
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Competência de Análise:</span>
            <select
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>
              Adimplência do Mês:{' '}
              <strong className="text-emerald-400 font-semibold">{complianceRate.toFixed(1)}%</strong>
            </span>
            <span>•</span>
            <span
              onClick={onOpenCryptoModal}
              className="text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Livro-Caixa Verificado
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total General Balance */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Saldo Geral Disponível
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatBRL(totalBalanceAll)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Conta Corrente Itaú + Caixa</span>
            </div>
          </div>
        </div>

        {/* Month Revenues */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Receitas do Mês
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatBRL(monthIncome)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {monthTransactions.filter((t) => t.type === 'receita').length} entradas
              </span>
              <span>nesta competência</span>
            </div>
          </div>
        </div>

        {/* Month Expenses */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Despesas do Mês
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatBRL(monthExpense)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-rose-600 dark:text-rose-400">
                {monthTransactions.filter((t) => t.type === 'despesa').length} pagamentos
              </span>
              <span>realizados</span>
            </div>
          </div>
        </div>

        {/* Fundo de Reserva */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Fundo de Reserva
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatBRL(reserveFundTotal)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Poupança vinculada Caixa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Visual Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Evolution Comparison Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Evolução Mensal: Receitas vs Despesas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparativo mês a mês do condomínio e saldo operacional líquido
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-300">Receitas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                <span className="text-slate-600 dark:text-slate-300">Despesas</span>
              </div>
            </div>
          </div>

          {/* Interactive Responsive SVG / Bars Chart */}
          <div className="mt-6 space-y-5">
            {monthlyBalances.map((m) => {
              const maxVal = Math.max(
                ...monthlyBalances.map((b) => Math.max(b.income, b.expense)),
                10000
              );
              const incomePercent = Math.min(100, Math.round((m.income / maxVal) * 100));
              const expensePercent = Math.min(100, Math.round((m.expense / maxVal) * 100));
              const isSelected = m.monthKey === selectedMonth;

              return (
                <div
                  key={m.monthKey}
                  onClick={() => onChangeMonth(m.monthKey)}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-50 dark:bg-slate-750 border border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-700/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      {m.month}
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold">
                          Ativo
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-bold ${
                        m.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      Saldo: {m.balance >= 0 ? '+' : ''}
                      {formatBRL(m.balance)}
                    </span>
                  </div>

                  {/* Dual Bar Comparison */}
                  <div className="space-y-1.5">
                    {/* Income Bar */}
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-[11px] text-slate-500 dark:text-slate-400 text-right">
                        {formatBRL(m.income)}
                      </span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${incomePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Expense Bar */}
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-[11px] text-slate-500 dark:text-slate-400 text-right">
                        {formatBRL(m.expense)}
                      </span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${expensePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Superávit banner */}
          <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Resultado Operacional do Mês Selecionado</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {monthNet >= 0 ? 'Superávit de ' : 'Déficit de '}
                <span className={monthNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                  {formatBRL(Math.abs(monthNet))}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Cotas Arrecadadas</div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {paidUnits} de {totalUnits} apartamentos
              </div>
            </div>
          </div>
        </div>

        {/* Top Expense Categories Breakdown (1 col) */}
        <div className="bg-white dark:bg-slate-800/90 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-500" />
                Maiores Despesas Prediais
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Principais centros de custo do Residencial Jasmim
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {sortedCategories.map(([category, amount], idx) => {
                const pct = Math.round((amount / totalAnalyzedExpense) * 100);
                const colors = [
                  'bg-rose-500',
                  'bg-amber-500',
                  'bg-blue-500',
                  'bg-indigo-500',
                  'bg-teal-500',
                ];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]" title={category}>
                        {category}
                      </span>
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-slate-900 dark:text-white">{formatBRL(amount)}</span>
                        <span className="text-[11px] font-bold text-slate-500 w-8">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${barColor} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Units Status Widget */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Status dos 14 Apartamentos (103 a 504)</span>
              <button
                onClick={onOpenUnitsModal}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                Ver todos ↗
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{paidUnits}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Em dia</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                <div className="text-base font-bold text-amber-600 dark:text-amber-400">{pendingUnits}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Pendente</div>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
                <div className="text-base font-bold text-rose-600 dark:text-rose-400">{delinquentUnits}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Em atraso</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
