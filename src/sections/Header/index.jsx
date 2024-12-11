import { useState } from 'react';
import { Burger, Container, Group, Button } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { useDisclosure } from '@mantine/hooks';
import classes from './index.module.css';

const links = [
  { link: '/about', label: 'Features' },
  { link: '/pricing', label: 'Pricing' },
  { link: '/learn', label: 'Learn' },
  { link: '/community', label: 'Community' },
];

export function Header() {
  const { toggle: toggleFullscreen, fullscreen } = useFullscreen();

  const [opened, { toggle: toggleDisclosure }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Button onClick={toggleFullscreen} color={fullscreen ? 'red' : 'blue'}>
          {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </Button>
        <Burger opened={opened} onClick={toggleDisclosure} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}