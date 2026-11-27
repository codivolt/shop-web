export const RECEIPT_REQUIRED_TYPES = new Set([
  "card_to_card",
  "sheba",
  "crypto",
]);

export function requiresReceipt(type: string | null | undefined): boolean {
  return Boolean(type) && RECEIPT_REQUIRED_TYPES.has(type as string);
}