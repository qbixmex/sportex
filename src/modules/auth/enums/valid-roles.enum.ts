export const VALID_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'super_admin',
} as const;

export type ValidRoles = typeof VALID_ROLES[keyof typeof VALID_ROLES];
