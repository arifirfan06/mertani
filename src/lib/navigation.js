export const navigation = [
  {
    title: 'Detail Pemantauan',
    path: '/pemantauan',
    icon: '📊',
    match: (url) => url.pathname.startsWith('/pemantauan'),
  },
  {
    title: 'Informasi Device',
    path: '/informasi',
    icon: 'ℹ️',
    match: (url) => url.pathname === '/informasi',
  },
  {
    title: 'Sensor Device',
    path: '/sensor',
    icon: '🛰️',
    match: (url) => url.pathname === '/sensor',
  },
];
