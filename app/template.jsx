// A template remounts on every navigation, which is exactly the cue the route
// transition needs. Keeping it this thin means pages stay server components.
import PageTransition from "@components/motion/PageTransition";

export default function Template({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
