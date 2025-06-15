import React from "react";

export function useGenericToggle() {
  const [opened, setOpened] = React.useState(false);

  const open = () => setOpened((prev) => !prev);
  const close = () => setOpened(false);
  const toggle = () => setOpened((prev) => !prev);

  return {
    opened,
    open,
    close,
    toggle,
  };
}
