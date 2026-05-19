const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-orange-600',
  'bg-cyan-600',
  'bg-pink-600',
  'bg-lime-600',
] as const;

export function getAvatarColor(id: string): string {
  return AVATAR_COLORS[parseInt(id) % AVATAR_COLORS.length];
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
