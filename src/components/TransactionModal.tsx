import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Tag,
  Building,
  FileText,
  CreditCard,
  ShieldCheck,
  Paperclip,
} from 'lucide-react';
import { EXPENSE_CATEGORIES, REVENUE_CATEGORIES } from '../data/initialData';
import { generateTransactionHash } from '../services/crypto';
import { PaymentMethod, Transaction, TransactionStatus, TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialType = 'despesa',
  editingTransaction,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [recipientOrUnit, setRecipientOrUnit] = useState<string>('');
  const [status, setStatus] = useState<TransactionStatus>('pago');
  const [notes, setNotes] = useState<string>('');
  const [receiptName, setReceiptName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setRecipientOrUnit(editingTransaction.recipientOrUnit);
      setStatus(editingTransaction.status);
      setNotes(editingTransaction.notes || '');
      setReceiptName(editingTransaction.receiptName || '');
    } else {
      setType(initialType);
      setAmount('');
      setCategory(initialType === 'receita' ? REVENUE_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('pix');
      setRecipientOrUnit('');
      setStatus('pago');
      setNotes('');
      setReceiptName('');
    }
  }, [editingTransaction, initialType, isOpen]);

  // Adjust default category when type switches
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'receita' ? REVENUE_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const categoriesList = type === 'receita' ? REVENUE_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Por favor, informe um valor numérico válido maior que zero.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor, informe uma descrição para o lançamento.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalCategory = category === 'OUTRA' ? customCategory : category;
      const now = new Date().toISOString();

      const txBase: Omit<Transaction, 'cryptoHash'> = {
        id: editingTransaction ? editingTransaction.id : 'tx-' + Date.now(),
        type,
        category: finalCategory || 'Geral',
        description: description.trim(),
        amount: numAmount,
        date,
        paymentMethod,
        recipientOrUnit: recipientOrUnit.trim() || 'Residencial Jasmim',
        status,
        notes: notes.trim(),
        receiptName: receiptName || undefined,
        verifiedByCouncil: editingTransaction ? editingTransaction.verifiedByCouncil : false,
        verifiedAt: editingTransaction ? editingTransaction.verifiedAt : undefined,
        verifiedBy: editingTransaction ? editingTransaction.verifiedBy : undefined,
        createdAt: editingTransaction ? editingTransaction.createdAt : now,
        updatedAt: now,
      };

      // Compute tamper-proof SHA-256 fingerprint
      const cryptoHash = await generateTransactionHash(txBase);

      const finalTransaction: Transaction = {
        ...txBase,
        cryptoHash,
      };

      onSave(finalTransaction);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar lançamento:', err);
      alert('Erro ao calcular criptografia do lançamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700 bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                type === 'receita'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}
            >
              {type === 'receita' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento em Tempo Real'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Residencial Jasmim • Banco Itaú</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Type Selector (Despesa / Receita) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('receita')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                type === 'receita'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Receita (+)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('despesa')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                type === 'despesa'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Despesa (-)</span>
            </button>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data do Lançamento *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Categoria *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="OUTRA">+ Outra Categoria personalizada...</option>
            </select>

            {category === 'OUTRA' && (
              <input
                type="text"
                placeholder="Digite a categoria personalizada..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-2 w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição Detalhada *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Manutenção preventiva bombas d'água Bloco A e B"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Recipient / Unit and Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'receita' ? 'Unidade / Apartamento / Pagador' : 'Fornecedor / Favorecido'}
              </label>
              <input
                type="text"
                placeholder={type === 'receita' ? 'Ex: Apt 201 Bloco A' : 'Ex: Sabesp S.A.'}
                value={recipientOrUnit}
                onChange={(e) => setRecipientOrUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="pix">Pix (Transferência instantânea)</option>
                <option value="boleto">Boleto Bancário Itaú</option>
                <option value="debito">Débito Automático</option>
                <option value="transferencia">Transferência TED / DOC</option>
                <option value="cartao">Cartão de Crédito Corporativo</option>
                <option value="dinheiro">Dinheiro (Caixa Pequeno)</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Situação do Pagamento
            </label>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                <input
                  type="radio"
                  name="tx-status"
                  value="pago"
                  checked={status === 'pago'}
                  onChange={() => setStatus('pago')}
                  className="text-emerald-500 focus:ring-0"
                />
                <span className="text-emerald-600 dark:text-emerald-400">Liquidado / Pago</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                <input
                  type="radio"
                  name="tx-status"
                  value="pendente"
                  checked={status === 'pendente'}
                  onChange={() => setStatus('pendente')}
                  className="text-amber-500 focus:ring-0"
                />
                <span className="text-amber-600 dark:text-amber-400">Pendente</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                <input
                  type="radio"
                  name="tx-status"
                  value="agendado"
                  checked={status === 'agendado'}
                  onChange={() => setStatus('agendado')}
                  className="text-blue-500 focus:ring-0"
                />
                <span className="text-blue-600 dark:text-blue-400">Agendado</span>
              </label>
            </div>
          </div>

          {/* Comprovante / Anexo Simulado */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Comprovante / Nota Fiscal (Anexo para o Conselho Fiscal)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium cursor-pointer transition-colors">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Anexar PDF / Foto</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setReceiptName(file.name);
                    }
                  }}
                />
              </label>
              {receiptName ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">
                  ✓ {receiptName}
                </span>
              ) : (
                <span className="text-xs text-slate-400">Nenhum arquivo anexado</span>
              )}
            </div>
          </div>

          {/* Cryptography notice */}
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800/60 flex items-center gap-2.5 text-xs text-teal-800 dark:text-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Ao salvar, este lançamento receberá uma <strong>assinatura SHA-256 única</strong> e
              disparará uma <strong>notificação push</strong> para todos os síndicos.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all active:scale-95 cursor-pointer ${
                type === 'receita'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-700/20'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-700/20'
              }`}
            >
              {isSubmitting ? 'Criptografando...' : editingTransaction ? 'Salvar Alterações' : 'Confirmar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
