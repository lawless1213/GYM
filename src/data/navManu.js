import {
  IconGauge,
  IconListDetails,
  IconHome2,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';

export const navLinks = [
  { link: '/', label: 'Home', icon: IconHome2 },
  { link: '/exercises', label: 'Exercises', icon: IconListDetails },
  { link: '/workout', label: 'Workout', icon: IconGauge, loginRequired: true },
  { link: '/profile', label: 'Profile', icon: IconUser, loginRequired: true },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];