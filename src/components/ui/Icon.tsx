'use client';

import { Icon as IconifyIcon } from '@iconify/react';
import { ComponentProps } from 'react';

type IconProps = ComponentProps<typeof IconifyIcon>;

export function Icon(props: IconProps) {
  return <IconifyIcon {...props} />;
}
