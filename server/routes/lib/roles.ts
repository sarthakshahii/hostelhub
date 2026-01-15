export const requireRole = (user: any, roles: string[]) => {
  if (!user) return false;
  return roles.includes(user.role);
};
