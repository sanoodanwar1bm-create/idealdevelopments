// Touch devices get "lite" effects: no backdrop-filter or masks, which overload
// the iOS compositor (see .fx-lite in globals.css). ?fx=full restores the full
// effects on a phone for comparison; ?fx=lite forces lite mode on desktop.
// Runs inline in <head>, so it is wrapped to keep `q` and `fx` off the window.
export const FX_MODE_SCRIPT =
  "(function(){var q=new URLSearchParams(location.search),fx=q.get('fx');" +
  "if(fx==='lite'||(matchMedia('(hover: none) and (pointer: coarse)').matches&&fx!=='full'))" +
  "document.documentElement.classList.add('fx-lite');})()";

// For effects and event handlers only: the class exists before hydration, but
// reading it during render would make the server and client output differ.
export const isLite = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("fx-lite");
