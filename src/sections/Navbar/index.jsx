import {
  IconLogout,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import { Stack, Tooltip, ActionIcon } from '@mantine/core';
import { NavLink, useLocation } from "react-router-dom";
import { navLinks } from '../../data/navManu';
import classes from './index.module.css';


function NavbarLink({ label, icon: Icon, url, onClick, variant }) {
  if (url) {
    return (
			<Tooltip label={label} position="right"  transitionProps={{ transition: 'scale-x', duration: 200 }}>
				<ActionIcon component={NavLink} to={url} variant={variant} size="xl">
					<Icon size={20} stroke={1.5} />
				</ActionIcon>
			</Tooltip>
    );
  }

  return (
    <Tooltip label={label} position="right" transitionProps={{ transition: 'scale-x', duration: 200 }}>
			<ActionIcon variant={variant} size="xl" onClick={onClick}>
				<Icon size={20} stroke={1.5} />
			</ActionIcon>
		</Tooltip>
  );
}

export function Navbar() {
  const location = useLocation();

  const links = navLinks.map((navItem) => {
		const isActive = location.pathname === navItem.link;

		return (
			<NavbarLink
				{...navItem}
				label={navItem.label}
				key={navItem.label}
				url={navItem.link}
				variant={isActive ? "filled" : "default"}
				onClick={() => {}}
			/>
		);
	});

  return (
    <nav className={classes.navbar}>
			<Stack className={classes.menu} justify="center" gap={4} mb={4}>
				{links}
			</Stack>
			<Stack justify="center" gap={4} mt="auto">
				<NavbarLink icon={IconSwitchHorizontal} label="Change account" variant='default'/>
				<NavbarLink icon={IconLogout} label="Logout" variant='default'/>
			</Stack>
    </nav>
  );
}