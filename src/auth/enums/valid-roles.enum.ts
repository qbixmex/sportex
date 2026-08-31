export const VALID_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type ValidRoles = typeof VALID_ROLES[keyof typeof VALID_ROLES];
