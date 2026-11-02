import { getConsoleFunction, setConsoleFunction } from "three";

/*
 * three r183 deprecated THREE.Clock in favour of THREE.Timer and warns from its
 * constructor. @react-three/fiber still builds one per Canvas (checked against
 * 9.8.1), so every scene prints the same notice and genuine warnings get lost
 * in it. Nothing in this project touches Clock directly.
 *
 * setConsoleFunction is three's own logging hook, so this only ever sees three's
 * messages — never anything else on the page. Delete this file once fiber moves
 * to THREE.Timer; the match is exact so it can't hide anything new.
 */

const SILENCED = "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.";

let installed = false;

export function quietUpstreamWarnings() {
  if (installed || getConsoleFunction()) return;
  installed = true;
  setConsoleFunction((method, message, ...rest) => {
    if (method === "warn" && message === SILENCED) return;
    (console[method] ?? console.log)(message, ...rest);
  });
}
