// Description: Native pass-through for the web phone frame.
// Description: On iOS and Android the device is the frame; this renders children directly.

import React from 'react';

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
