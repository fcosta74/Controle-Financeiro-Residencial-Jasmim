import { Transaction } from '../types';

/**
 * Computes an immutable SHA-256 cryptographic hash for a transaction.
 * Uses the Web Crypto API for client-side cryptographic hashing.
 */
export async function generateTransactionHash(
  data: Omit<Transaction, 'cryptoHash'>
): Promise<string> {
  const canonicalString = JSON.stringify({
    id: data.id,
    type: data.type,
    amount: data.amount,
    date: data.date,
    category: data.category,
    description: data.description.trim(),
    recipientOrUnit: data.recipientOrUnit.trim(),
    paymentMethod: data.paymentMethod,
    createdAt: data.createdAt,
  });

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(canonicalString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verifies that a transaction's hash matches its current data.
 */
export async function verifyTransactionHash(tx: Transaction): Promise<boolean> {
  const expectedHash = await generateTransactionHash(tx);
  return expectedHash === tx.cryptoHash;
}

/**
 * Validates the entire ledger and returns verification status.
 */
export async function verifyLedgerIntegrity(
  transactions: Transaction[]
): Promise<{ validCount: number; invalidCount: number; details: { id: string; isValid: boolean }[] }> {
  let validCount = 0;
  let invalidCount = 0;
  const details = [];

  for (const tx of transactions) {
    const isValid = await verifyTransactionHash(tx);
    if (isValid) {
      validCount++;
    } else {
      invalidCount++;
    }
    details.push({ id: tx.id, isValid });
  }

  return { validCount, invalidCount, details };
}

/**
 * Formats a long hash for concise UI display (e.g. e3b0c4...b855)
 */
export function formatCryptoHash(hash: string): string {
  if (!hash || hash.length < 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}
