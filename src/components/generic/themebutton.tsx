import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeButton() {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      radius="xl"
      aria-label="Toggle color scheme"
    >
      {colorScheme === 'light' ? (
        <IconMoon stroke={1.5} />
      ) : (
        <IconSun stroke={1.5} />
      )}
    </ActionIcon>
  );
}
