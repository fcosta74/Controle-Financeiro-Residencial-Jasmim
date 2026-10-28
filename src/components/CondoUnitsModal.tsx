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
  Edit2,
  Save,
  Check,
} from 'lucide-react';
import { CondoUnit, UserRole } from '../types';
import buildingLogo from '../assets/images/jasmim_building_logo_1793191822353.jpg';

interface CondoUnitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: CondoUnit[];
  currentRole: UserRole;
  onRegisterUnitPayment: (unit: CondoUnit) => void;
  onUpdateUnit?: (unit: CondoUnit) => void;
}

export const CondoUnitsModal: React.FC<CondoUnitsModalProps> = ({
  isOpen,
  onClose,
  units,
  currentRole,
  onRegisterUnitPayment,
  onUpdateUnit,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'adimplente' | 'pendente' | 'atrasado'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state for resident
  const [editingUnit, setEditingUnit] = useState<CondoUnit | null>(null);
  const [editResidentName, setEditResidentName] = useState('');
  const [editMonthlyFee, setEditMonthlyFee] = useState(501);
  const [editStatus, setEditStatus] = useState<'adimplente' | 'pendente' | 'atrasado'>('adimplente');
  const [editPaymentDate, setEditPaymentDate] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (u: CondoUnit) => {
    setEditingUnit(u);
    setEditResidentName(u.residentName);
    setEditMonthlyFee(u.monthlyFee);
    setEditStatus(u.status);
    setEditPaymentDate(u.lastPaymentDate || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;

    const updated: CondoUnit = {
      ...editingUnit,
      residentName: editResidentName.trim() || `Morador Apto ${editingUnit.unitNumber}`,
      monthlyFee: Number(editMonthlyFee) || 501,
      status: editStatus,
      lastPaymentDate: editPaymentDate || undefined,
    };

    if (onUpdateUnit) {
      onUpdateUnit(updated);
    }
    setEditingUnit(null);
  };

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

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const floors = ['1º Andar', '2º Andar', '3º Andar', '4º Andar', '5º Andar'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700 bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-md shrink-0">
              <img
                src={buildingLogo}
                alt="Brasão Residencial Jasmim"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                Gestão dos 14 Apartamentos • Residencial Jasmim
              </h2>
              <p className="text-xs text-slate-400">
                Aptos 103, 104, 202, 203, 204, 302, 303, 304, 402, 403, 404, 502, 503, 504
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-center">
              <div className="text-[11px] text-slate-400 font-semibold">Total Unidades</div>
              <div className="text-lg font-bold text-white mt-0.5">{total} aptos</div>
            </div>
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/50 text-center">
              <div className="text-[11px] text-emerald-400 font-semibold">Em Dia</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">{adimplentes} aptos</div>
            </div>
            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/50 text-center">
              <div className="text-[11px] text-amber-400 font-semibold">Pendentes</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{pendentes} aptos</div>
            </div>
            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/50 text-center">
              <div className="text-[11px] text-rose-400 font-semibold">Em Atraso</div>
              <div className="text-lg font-bold text-rose-400 mt-0.5">{atrasados} aptos</div>
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
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Floor Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setSelectedFloor('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedFloor === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos (14)
              </button>
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedFloor === floor
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredUnits.map((u) => {
              const isPaid = u.status === 'adimplente';
              const isPending = u.status === 'pendente';
              const isLate = u.status === 'atrasado';

              return (
                <div
                  key={u.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isPaid
                      ? 'bg-slate-800/90 border-slate-700 hover:border-slate-600'
                      : isPending
                      ? 'bg-amber-950/20 border-amber-800/60 hover:border-amber-700'
                      : 'bg-rose-950/20 border-rose-800/60 hover:border-rose-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-white">
                          Apt {u.unitNumber}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                          {u.block}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                            : isPending
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        }`}
                      >
                        {isPaid ? 'Pago' : isPending ? 'Pendente' : 'Atrasado'}
                      </span>
                    </div>

                    {/* Resident Name & Quick Edit Trigger */}
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium mt-1">
                      <div className="flex items-center gap-1 truncate pr-1">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-semibold text-white">{u.residentName}</span>
                      </div>
                      {currentRole === 'sindico' && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(u)}
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-700/80 transition-colors cursor-pointer shrink-0"
                          title="Alterar nome do morador ou cota"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-400 mt-1.5 flex items-center justify-between">
                      <span>Cota Mensal:</span>
                      <strong className="text-white font-bold">{formatBRL(u.monthlyFee)}</strong>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px]">
                      {u.lastPaymentDate ? `Pago: ${u.lastPaymentDate.split('-')[2]}/${u.lastPaymentDate.split('-')[1]}` : 'Sem reg.'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {currentRole === 'sindico' && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(u)}
                          className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-slate-300" />
                          <span>Editar</span>
                        </button>
                      )}

                      {!isPaid && currentRole === 'sindico' && (
                        <button
                          type="button"
                          onClick={() => onRegisterUnitPayment(u)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          title="Registrar recebimento de cota no Banco Itaú"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Baixar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal / Dialog for Editing Resident Name */}
        {editingUnit && (
          <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Editar Morador • Apt {editingUnit.unitNumber}
                    </h3>
                    <p className="text-xs text-slate-400">{editingUnit.block}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUnit(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nome do Morador / Proprietário
                  </label>
                  <input
                    type="text"
                    required
                    value={editResidentName}
                    onChange={(e) => setEditResidentName(e.target.value)}
                    placeholder="Ex: João Silva ou Maria Santos"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Este nome aparecerá nos relatórios, extratos e no Google Planilhas.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Cota Mensal (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editMonthlyFee}
                      onChange={(e) => setEditMonthlyFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Situação de Pagamento
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs cursor-pointer"
                    >
                      <option value="adimplente">Pago (Adimplente)</option>
                      <option value="pendente">Pendente</option>
                      <option value="atrasado">Em Atraso</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Data do Último Pagamento (opcional)
                  </label>
                  <input
                    type="date"
                    value={editPaymentDate}
                    onChange={(e) => setEditPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-slate-700 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUnit(null)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-700/30 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
