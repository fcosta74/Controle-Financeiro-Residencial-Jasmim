import { CondoUnit, MonthlyBalance, Transaction } from '../types';
import { getAccessToken } from './firebaseAuth';

export interface CreateSpreadsheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
}

/**
 * Creates a brand new Google Spreadsheet in Google Drive formatted for Residencial Jasmim
 */
export async function createCondoSpreadsheet(
  title = 'Residencial Jasmim - Controle Financeiro'
): Promise<CreateSpreadsheetResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Não autenticado com o Google. Por favor, conecte sua conta Google.');
  }

  const payload = {
    properties: {
      title,
      locale: 'pt_BR',
      autoRecalc: 'ON_CHANGE',
      defaultFormat: {
        textFormat: { fontFamily: 'Roboto', fontSize: 10 },
      },
    },
    sheets: [
      {
        properties: {
          title: 'Lançamentos',
          gridProperties: { frozenRowCount: 1, columnCount: 12 },
        },
      },
      {
        properties: {
          title: 'Resumo Mensal',
          gridProperties: { frozenRowCount: 1, columnCount: 6 },
        },
      },
      {
        properties: {
          title: 'Unidades e Inadimplência',
          gridProperties: { frozenRowCount: 1, columnCount: 6 },
        },
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Falha ao criar planilha no Google Drive.');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Synchronizes all transactions, monthly balances, and units to the Google Sheet.
 */
export async function syncDataToSpreadsheet(
  spreadsheetId: string,
  transactions: Transaction[],
  monthlyBalances: MonthlyBalance[],
  units: CondoUnit[]
): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Não autenticado com o Google. Faça login para sincronizar.');
  }

  // 1. Prepare Sheet "Lançamentos"
  const txHeaders = [
    'ID',
    'Data',
    'Tipo',
    'Categoria',
    'Descrição',
    'Valor (R$)',
    'Forma de Pagamento',
    'Destinatário / Unidade',
    'Status',
    'Auditoria Conselho',
    'Hash SHA-256 (Criptografia)',
    'Última Atualização',
  ];

  const txRows = transactions.map((t) => [
    t.id,
    t.date,
    t.type === 'receita' ? 'RECEITA (+)' : 'DESPESA (-)',
    t.category,
    t.description,
    t.type === 'receita' ? t.amount : -t.amount,
    t.paymentMethod.toUpperCase(),
    t.recipientOrUnit,
    t.status.toUpperCase(),
    t.verifiedByCouncil ? 'VERIFICADO' : 'PENDENTE',
    t.cryptoHash,
    t.updatedAt || t.createdAt,
  ]);

  // 2. Prepare Sheet "Resumo Mensal"
  const summaryHeaders = ['Mês / Ano', 'Receitas (R$)', 'Despesas (R$)', 'Saldo Líquido (R$)', 'Situação'];
  const summaryRows = monthlyBalances.map((m) => [
    m.monthKey,
    m.income,
    m.expense,
    m.balance,
    m.balance >= 0 ? 'SUPERÁVIT' : 'DÉFICIT',
  ]);

  // 3. Prepare Sheet "Unidades e Inadimplência"
  const unitsHeaders = ['Andar / Localização', 'Apartamento', 'Morador / Proprietário', 'Cota Mensal (R$)', 'Status', 'Último Pagamento'];
  const unitsRows = units.map((u) => [
    u.block,
    u.unitNumber,
    u.residentName,
    u.monthlyFee,
    u.status.toUpperCase(),
    u.lastPaymentDate || 'Não informado',
  ]);

  // Send batch update of values to Google Sheets
  const updatePayload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      {
        range: 'Lançamentos!A1:L' + (txRows.length + 1),
        values: [txHeaders, ...txRows],
      },
      {
        range: 'Resumo Mensal!A1:E' + (summaryRows.length + 1),
        values: [summaryHeaders, ...summaryRows],
      },
      {
        range: 'Unidades e Inadimplência!A1:F' + (unitsRows.length + 1),
        values: [unitsHeaders, ...unitsRows],
      },
    ],
  };

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || 'Falha ao atualizar dados na planilha Google.'
    );
  }
}

/**
 * Downloads transactions as CSV file for local backup
 */
export function downloadTransactionsCSV(transactions: Transaction[]) {
  const headers = [
    'ID',
    'Data',
    'Tipo',
    'Categoria',
    'Descricao',
    'Valor_BRL',
    'Forma_Pagamento',
    'Destinatario_Unidade',
    'Status',
    'Verificado_Conselho',
    'Hash_SHA256',
  ];

  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type,
    `"${t.category.replace(/"/g, '""')}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    t.paymentMethod,
    `"${t.recipientOrUnit.replace(/"/g, '""')}"`,
    t.status,
    t.verifiedByCouncil ? 'Sim' : 'Nao',
    t.cryptoHash,
  ]);

  const csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Residencial_Jasmim_Lancamentos_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
