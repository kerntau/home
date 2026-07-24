import { memo } from "react";

type ThemeMode = "light" | "dark";

const BackgroundAtmosphere = memo(function BackgroundAtmosphere({ theme }: { theme: ThemeMode }) {
  // The visual effect is purely driven by CSS variables in .atmosphere
  return <div className="atmosphere" aria-hidden="true" data-theme={theme} />;
});

export default BackgroundAtmosphere;
