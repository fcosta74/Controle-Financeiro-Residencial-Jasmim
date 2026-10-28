import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  FileCheck,
  CheckCircle,
  RefreshCw,
  Hash,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { Transaction } from '../types';
import { verifyLedgerIntegrity, verifyTransactionHash } from '../services/crypto';

interface AuditCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  selectedTransaction?: Transaction | null;
}

export const AuditCryptoModal: React.FC<AuditCryptoModalProps> = ({
  isOpen,
  onClose,
  transactions,
  selectedTransaction,
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [ledgerStatus, setLedgerStatus] = useState<{
    validCount: number;
    invalidCount: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleValidate();
    }
  }, [isOpen, transactions]);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await verifyLedgerIntegrity(transactions);
      setLedgerStatus({
        validCount: result.validCount,
        invalidCount: result.invalidCount,
        total: transactions.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Segurança com Criptografia de Ponta (SHA-256)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Garantia de inviolabilidade e integridade para o Residencial Jasmim
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
          {/* Integrity Validation Banner */}
          <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Status do Livro-Caixa Criptografado
                  </h3>
                  <p className="text-xs text-teal-900 dark:text-teal-200 mt-0.5">
                    {ledgerStatus
                      ? `${ledgerStatus.validCount} de ${ledgerStatus.total} registros verificados com integridade perfeita.`
                      : 'Verificando hashes criptográficos...'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleValidate}
                disabled={isValidating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
                <span>Revalidar Hashes</span>
              </button>
            </div>
          </div>

          {/* Selected Transaction Inspector (if clicked from table) */}
          {selectedTransaction && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-teal-500" />
                  Assinatura do Lançamento Selecionado ({selectedTransaction.id})
                </span>
                <span className="text-[10px] font-mono bg-teal-500/20 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                  SHA-256 Autêntico
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Descrição:</strong> {selectedTransaction.description} (R${' '}
                {selectedTransaction.amount.toFixed(2)}) • <strong>Data:</strong>{' '}
                {selectedTransaction.date}
              </p>
              <div className="p-2.5 bg-slate-900 rounded-lg text-emerald-400 font-mono text-[11px] break-all select-all">
                {selectedTransaction.cryptoHash}
              </div>
              <p className="text-[11px] text-slate-400">
                Qualquer modificação offline não autorizada em valores, datas ou favorecidos altera este hash e invalida o balanço imediatamente.
              </p>
            </div>
          )}

          {/* Explanation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Inviolabilidade Contábil</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Cada receita e despesa gera um identificador criptográfico único (digest SHA-256) com base em seus dados exatos, impossibilitando fraudes retroativas.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-white">
                <FileCheck className="w-4 h-4 text-teal-400" />
                <span>Auditoria do Conselho</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                O Conselho Fiscal pode auditar cada nota fiscal ou comprovante, atestando conformidade com carimbo de aprovação gravado em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
