import {
  IconLogin,
  IconLogout,
} from '@tabler/icons-react';
import { Stack, Title, Tooltip, ActionIcon } from '@mantine/core';
import { NavLink, useLocation } from "react-router-dom";
import { navLinks } from '../../data/navManu';
import { modals } from '@mantine/modals';
import s from './index.module.css';
import { useAuth } from '../../stores/context/AuthContext';
import ProtectedRoute from '../../systemComponents/ProtectedRoute';

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
	const { currentUser, logOut } = useAuth();
  const location = useLocation();

  const links = navLinks
	.filter((navItem) => {
    return !navItem.loginRequired || currentUser;
  })
	.map((navItem) => {
		const isActive = location.pathname === navItem.link;

    const linkElement = (
			<NavbarLink
				{...navItem}
				label={navItem.label}
				key={navItem.label}
				url={navItem.link}
				variant={isActive ? "filled" : "default"}
			/>
		);

		return navItem.loginRequired ? (
			<ProtectedRoute key={navItem.label}>{linkElement}</ProtectedRoute>
		) : (
			linkElement
		);
  });

	const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <nav className={s.navbar}>
			<Stack className={s.menu} justify="center" gap={4} mb={4}>
				{links}
			</Stack>
			<Stack justify="center" gap={4} mt="auto">
				{currentUser ? 
					<NavbarLink 
						icon={IconLogout} 
						label="Logout" 
						variant='default' 
						onClick={handleLogout}
					/>
				:
					<NavbarLink 
						icon={IconLogin} 
						label="Login" 
						variant='default'
						onClick={() =>
							modals.openContextModal({
								modal: 'auth',
								size: 'lg',
							})
						}
					/> 
				}
			</Stack>
    </nav>
  );
}