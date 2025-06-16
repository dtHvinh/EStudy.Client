import React from "react";

export function useGenericToggle(defaultOpen: boolean = false) {
  const [opened, setOpened] = React.useState(defaultOpen);

  return {
    opened,
    open: () => setOpened(true),
    close: () => setOpened(false),
    toggle: () => setOpened((prev) => !prev),
    openChange: (open: boolean) => setOpened(open),
  };
}
