/**
 * API response normalization helpers.
 *
 * Prisma enums are serialized as UPPERCASE strings (e.g. "ACTIVE", "AUDIT").
 * UI types use lowercase (e.g. "active", "audit"). These helpers bridge
 * the gap so components can keep using readable lowercase literals.
 */

/**
 * Lowercase a single enum string from the API.
 */
export function normalizeEnum<T extends string>(value: T): Lowercase<T> {
  return value.toLowerCase() as Lowercase<T>;
}

/**
 * Normalize specified enum fields in a record from UPPERCASE → lowercase.
 * Returns a shallow copy with the enum fields lowercased.
 */
export function normalizeRecord<T>(
  record: T,
  enumFields: (keyof T)[],
): T {
  const result = { ...record };
  for (const field of enumFields) {
    const val = result[field];
    if (typeof val === "string") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[field] = val.toLowerCase();
    }
  }
  return result;
}

/**
 * Normalize an array of records.
 */
export function normalizeRecords<T>(
  records: T[],
  enumFields: (keyof T)[],
): T[] {
  return records.map((r) => normalizeRecord(r, enumFields));
}
