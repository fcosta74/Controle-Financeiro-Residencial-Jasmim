import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Building,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
  ShieldCheck,
  Smartphone,
  Users,
  Edit2,
  Lock,
  ChevronRight,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import buildingLogo from '../assets/images/jasmim_building_logo_1793191822353.jpg';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const [activeTopic, setActiveTopic] = useState<'inicio' | 'moradores' | 'lancamentos' | 'drive' | 'auditoria' | 'instalacao'>('inicio');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-md shrink-0">
              <img
                src={buildingLogo}
                alt="Logo Residencial Jasmim"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Manual de Utilização • Residencial Jasmim
              </h2>
              <p className="text-xs text-slate-400">
                Guia prático para Síndicos, Conselho Fiscal e Moradores
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

        {/* Body with Sidebar Tabs and Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-700 p-2 sm:p-3 bg-slate-950/60 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1">
            <button
              onClick={() => setActiveTopic('inicio')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTopic === 'inicio'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building className="w-4 h-4 shrink-0" />
              <span>1. Visão Geral & Perfis</span>
            </button>

            <button
              onClick={() => setActiveTopic('moradores')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTopic === 'moradores'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>2. Alterar Nome dos Moradores</span>
            </button>

            <button
              onClick={() => setActiveTopic('lancamentos')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTopic === 'lancamentos'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingDown className="w-4 h-4 shrink-0" />
              <span>3. Despesas e Receitas</span>
            </button>

            <button
              onClick={() => setActiveTopic('drive')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTopic === 'drive'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span>4. Planilha no Google Drive</span>
            </button>

            <button
              onClick={() => setActiveTopic('auditoria')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTopic === 'auditoria'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>5. Auditoria & Criptografia</span>
            </button>

            <button
              onClick={() => setActiveTopic('instalacao')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                activeTopic === 'instalacao'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              <span>6. Ícone no Celular e PC</span>
            </button>
          </div>

          {/* Topic Detail View */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
            {activeTopic === 'inicio' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-400" />
                  1. Visão Geral do Residencial Jasmim
                </h3>
                <p className="text-slate-300">
                  O aplicativo foi desenvolvido sob medida para a gestão financeira dos <strong>14 apartamentos</strong> do Residencial Jasmim, integrando as concessionárias locais (<strong>Embasa</strong> e <strong>Coelba</strong>) e a conta no <strong>Banco Itaú</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Perfil</span>
                    <h4 className="font-extrabold text-sm text-white mt-0.5">Síndico Geral</h4>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Acesso total: lançamento de receitas/despesas, edição de moradores dos 14 aptos, baixa de cotas e sincronização com Google Drive.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Perfil</span>
                    <h4 className="font-extrabold text-sm text-white mt-0.5">Conselho Fiscal</h4>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Fiscalização: conferência de notas fiscais, extratos e aposição de carimbo digital de auditoria aprovada.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Perfil</span>
                    <h4 className="font-extrabold text-sm text-white mt-0.5">Condômino</h4>
                    <p className="text-slate-400 text-[11px] mt-1">
                      Transparência: visualização do balanço mensal, despesas prediais e prestação de contas sem permissão de edição.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Para alternar de perfil a qualquer momento, use o seletor <strong>"Perfil"</strong> no canto superior direito da barra superior.</span>
                </div>
              </div>
            )}

            {activeTopic === 'moradores' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  2. Como Alterar o Nome do Morador de Cada Apartamento
                </h3>
                <p className="text-slate-300">
                  O condomínio possui 14 apartamentos distribuídos do 1º ao 5º andar. Para atualizar o nome do morador, proprietário ou o valor da cota mensal:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">1</span>
                    <div>
                      <strong className="text-white">Abra a Gestão de Apartamentos:</strong>
                      <p className="text-slate-300 mt-0.5">Clique no botão <strong>"14 Aptos"</strong> (no painel principal, no menu superior ou na barra inferior do celular).</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">2</span>
                    <div>
                      <strong className="text-white">Localize o Apartamento:</strong>
                      <p className="text-slate-300 mt-0.5">Você pode filtrar por andar (ex: <em>2º Andar</em>) ou digitar o número na barra de busca (ex: <em>202</em>).</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">3</span>
                    <div>
                      <strong className="text-white">Clique no botão de Edição (✏️ Editar Morador):</strong>
                      <p className="text-slate-300 mt-0.5">No card do apartamento, clique no ícone de lápis ou no botão <strong>"Editar Morador"</strong>.</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">4</span>
                    <div>
                      <strong className="text-white">Digite o Novo Nome e Salve:</strong>
                      <p className="text-slate-300 mt-0.5">Altere o campo <strong>"Nome do Morador / Proprietário"</strong>, ajuste a cota se necessário e clique em <strong>"Salvar Alterações"</strong>. Os dados são atualizados imediatamente e salvos!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === 'lancamentos' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                  3. Registro de Despesas e Receitas em Tempo Real
                </h3>
                <p className="text-slate-300">
                  Todo lançamento registrado atualiza os gráficos, o saldo bancário do Itaú e calcula o hash criptográfico imediatamente.
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <h4 className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" /> Para Lançar uma Receita (+):
                    </h4>
                    <p className="text-slate-300 mt-1">
                      Clique em <strong>"+ Nova Receita"</strong>. Escolha a categoria (ex: <em>Cota Condominial Ordinária</em> ou <em>Aluguel Salão de Festas</em>), digite o valor, selecione a unidade pagadora e o método (Pix ou Boleto Itaú).
                    </p>
                    <p className="text-slate-400 mt-1">
                      <em>Dica:</em> Você também pode dar baixa direta clicando em <strong>"Baixar Cota"</strong> dentro do painel dos 14 Aptos!
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <h4 className="font-extrabold text-rose-400 text-sm flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" /> Para Lançar uma Despesa (-):
                    </h4>
                    <p className="text-slate-300 mt-1">
                      Clique em <strong>"+ Nova Despesa"</strong>. Selecione a concessionária (ex: <em>Água e Esgoto (Embasa)</em> ou <em>Energia Elétrica (Coelba)</em>, <em>Manutenção Elevadores</em>, etc.), informe o valor, data e anexe a foto ou PDF da nota fiscal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === 'drive' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  4. Sincronização com Planilha no Google Drive
                </h3>
                <p className="text-slate-300">
                  O aplicativo se conecta diretamente com a sua conta do Google Workspace para alimentar uma planilha oficial no Google Drive:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <strong className="text-white">Criando a Planilha no seu Drive:</strong>
                    <p className="text-slate-300 mt-1">
                      Clique em <strong>"Planilha Google"</strong> &gt; <strong>"Criar Planilha Residencial Jasmim no Google Drive"</strong>. O sistema cria automaticamente as abas <em>Lançamentos</em>, <em>Resumo Mensal</em> e <em>Unidades e Inadimplência</em>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <strong className="text-white">Sincronização Automática ou Manual:</strong>
                    <p className="text-slate-300 mt-1">
                      Sempre que um novo lançamento é feito, o sistema envia para a planilha. Você também pode clicar em <strong>"Sincronizar Agora com o Drive"</strong> a qualquer momento.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <strong className="text-white">Visualização Direta:</strong>
                    <p className="text-slate-300 mt-1">
                      Clique no botão <strong>"Ver no Google Sheets ↗"</strong> para abrir a planilha em tempo real no seu navegador ou aplicativo do Google Planilhas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === 'auditoria' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  5. Auditoria do Conselho Fiscal & Criptografia SHA-256
                </h3>
                <p className="text-slate-300">
                  Garantia de segurança contra fraudes e transparência total para todos os moradores:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <h4 className="font-extrabold text-white text-sm">Carimbo Digital do Conselho Fiscal:</h4>
                    <p className="text-slate-300 mt-1">
                      No perfil <strong>Conselho Fiscal</strong>, na lista do Livro-Caixa, o auditor clica no botão <strong>"Pendente"</strong> de qualquer lançamento. Ao verificar o comprovante, o status muda para <strong>"Auditado ✓"</strong> com registro do nome do auditor e da data.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <h4 className="font-extrabold text-white text-sm">Inviolabilidade Criptográfica (SHA-256):</h4>
                    <p className="text-slate-300 mt-1">
                      Cada lançamento gera um código hash matemático único. Se alguém tentar alterar valores ou favorecidos offline, a assinatura torna-se inválida e o sistema alerta imediatamente. Clique no botão de escudo <strong>"SHA-256"</strong> no topo para auditar a integridade.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === 'instalacao' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  6. Como Fixar o Ícone no Computador e no Celular
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-teal-400" /> No Computador (Google Chrome / Edge):
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 mt-1.5">
                      <li>Abra o aplicativo no navegador (Google Chrome ou Edge).</li>
                      <li>Na barra de endereços (lado direito, onde fica o link), clique no ícone de <strong>"Instalar aplicativo"</strong> (ícone de computador com uma setinha).</li>
                      <li>Clique em <strong>Instalar</strong>. O ícone do Residencial Jasmim será criado na sua Área de Trabalho e na barra de tarefas!</li>
                      <li><em>Aba do Navegador:</em> O ícone (favicon) do brasão do Residencial Jasmim aparece na aba do navegador.</li>
                    </ol>
                  </div>

                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" /> No Celular Android (Google Chrome):
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 mt-1.5">
                      <li>Abra o link do aplicativo no Chrome do celular.</li>
                      <li>Toque nos <strong>3 pontinhos</strong> (canto superior direito do Chrome).</li>
                      <li>Toque em <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar aplicativo"</strong>.</li>
                      <li>O aplicativo ficará com o ícone do prédio na tela do seu celular, abrindo em tela cheia como um app nativo!</li>
                    </ol>
                  </div>

                  <div className="p-3.5 bg-slate-800 rounded-xl border border-slate-700">
                    <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-400" /> No iPhone / iPad (Safari):
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 mt-1.5">
                      <li>Abra o link no navegador <strong>Safari</strong>.</li>
                      <li>Toque no botão de <strong>Compartilhar</strong> (quadrado com setinha para cima).</li>
                      <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>Residencial Jasmim • Sistema de Gestão Financeira</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Entendi, Fechar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
