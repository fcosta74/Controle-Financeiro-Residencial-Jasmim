import React, { useState } from 'react';
import {
  X,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  DollarSign,
  User,
} from 'lucide-react';
import { CondoUnit, UserRole } from '../types';

interface CondoUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: CondoUnit[];
  currentRole: UserRole;
  onRegisterUnitPayment: (unit: CondoUnit) => void;
}

export const CondoUnitsModal: React.FC<CondoUnitsModalProps> = ({
  isOpen,
  onClose,
  units,
  currentRole,
  onRegisterUnitPayment,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'adimplente' | 'pendente' | 'atrasado'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredUnits = units.filter((u) => {
    if (selectedFloor !== 'all' && u.block !== selectedFloor) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNum = u.unitNumber.includes(q);
      const matchName = u.residentName.toLowerCase().includes(q);
      return matchNum || matchName;
    }
    return true;
  });

  const total = units.length;
  const adimplentes = units.filter((u) => u.status === 'adimplente').length;
  const atrasados = units.filter((u) => u.status === 'atrasado').length;
  const pendentes = units.filter((u) => u.status === 'pendente').length;
  const adimplenciaRate = total > 0 ? ((adimplentes / total) * 100).toFixed(1) : '100';

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const floors = ['1º Andar', '2º Andar', '3º Andar', '4º Andar', '5º Andar'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Gestão dos 14 Apartamentos • Residencial Jasmim
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aptos 103, 104, 202, 203, 204, 302, 303, 304, 402, 403, 404, 502, 503, 504
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
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Total Unidades</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{total} aptos</div>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-center">
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Em Dia</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{adimplentes} aptos</div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/50 text-center">
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Pendentes</div>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">{pendentes} aptos</div>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800/50 text-center">
              <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">Em Atraso</div>
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">{atrasados} aptos</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por apto (ex: 103, 202) ou morador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Floor Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setSelectedFloor('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                  selectedFloor === 'all'
                    ? 'bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Todos (14)
              </button>
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    selectedFloor === floor
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-teal-600'
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>
          </div>

          {/* Units Grid (Optimized for Mobile Screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredUnits.map((u) => {
              const isPaid = u.status === 'adimplente';
              const isPending = u.status === 'pendente';
              const isLate = u.status === 'atrasado';

              return (
                <div
                  key={u.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isPaid
                      ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      : isPending
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-slate-900 dark:text-white">
                          Apt {u.unitNumber}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                          {u.block}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isPaid ? 'Pago' : isPending ? 'Pendente' : 'Atrasado'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.residentName}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      Cota Mensal: <strong className="text-slate-800 dark:text-slate-200">{formatBRL(u.monthlyFee)}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">
                      {u.lastPaymentDate ? `Pago: ${u.lastPaymentDate.split('-')[2]}/${u.lastPaymentDate.split('-')[1]}` : 'Sem reg.'}
                    </span>

                    {!isPaid && currentRole === 'sindico' && (
                      <button
                        onClick={() => onRegisterUnitPayment(u)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title="Registrar recebimento de cota no Banco Itaú"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Baixar Cota</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
