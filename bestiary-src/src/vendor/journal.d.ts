export function a(
  link: string,
  visit: { returns: number; lastSeen: number | null },
  date?: Date,
): { on: boolean; level: number; note?: string };

export function o(
  prev: { days: string[]; last: number | null },
  now: number,
  offset: number,
): [{ days: string[]; last: number | null }, { returns: number; lastSeen: number | null }];

export function r(
  id: string,
  link: string,
  visit: { returns: number; lastSeen: number | null },
  date?: Date,
): void;
