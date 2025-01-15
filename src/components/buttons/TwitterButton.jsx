import { Button } from '@mantine/core';
import { IconBrandTwitterFilled } from '@tabler/icons-react';

export function TwitterButton(props) {
  return (
    <Button leftSection={<IconBrandTwitterFilled  size={16} color="#00ACEE" />} variant="default" {...props} />
  );
}