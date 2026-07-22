/**
 * Version of the deterministic algorithm used to derive Aeris color tokens.
 *
 * A change to an existing derived color for the same complete theme input must
 * increment this value. Build-time configurations can pin the version to make
 * an intentional regeneration step explicit during upgrades.
 */
export const AERIS_COLOR_DERIVATION_VERSION = 1 as const;

export type AerisColorDerivationVersion = typeof AERIS_COLOR_DERIVATION_VERSION;
