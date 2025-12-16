interface IRouteConfig {
  path: string;
  access: 'guest' | 'private' | 'public';
  roles?: Array<'ADMIN' | 'USER' | 'CREATOR'>;
}

const ROUTE_CONFIG: IRouteConfig[] = [
  { path: '/login', access: 'guest' },
  { path: '/register', access: 'guest' },
  { path: '/', access: 'guest' },
  { path: '/checkout', access: 'private' },
  { path: '/dashboard/categories', access: 'private', roles: ['ADMIN'] },
  { path: '/dashboard/overview', access: 'private', roles: ['ADMIN', 'CREATOR'] },
  { path: '/dashboard/payouts', access: 'private', roles: ['CREATOR'] },
  { path: '/dashboard/payouts-requests', access: 'private', roles: ['ADMIN'] },
  { path: '/dashboard/platform-settings', access: 'private', roles: ['ADMIN'] },
  { path: '/dashboard/products', access: 'private', roles: ['ADMIN', 'CREATOR'] },
  { path: '/dashboard/transactions', access: 'private', roles: ['ADMIN', 'CREATOR'] },
  { path: '/dashboard/upload', access: 'private', roles: ['CREATOR'] },
  { path: '/explore', access: 'public' },
  { path: '/my-purchases', access: 'private', roles: ['USER'] },
  { path: '/profile', access: 'private' },
];

export const ROUTE_MAP = new Map(ROUTE_CONFIG.map((route) => [route.path, route]));
