export const USERS = {
  USER:  { label: "@user",  isAuth: true, storagePath: "playwright/.auth/user.json" },
  ADMIN: { label: "@admin", isAuth: true, storagePath: "playwright/.auth/admin.json" },
} as const;

export const PROTECTED_TAG_RE: RegExp[] = Object.values(USERS)
  .filter(t => t.isAuth)
  .map(t => new RegExp(t.label));
