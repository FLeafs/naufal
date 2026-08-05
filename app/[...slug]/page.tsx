import { Invitation } from "../components/invitation";
import { configs } from "../config";

/**
 * Catch-all: semua path selain /qnet (mis. /undangan, /apa-saja)
 * menampilkan undangan mode PUBLIC.
 */
export default function CatchAllPage() {
  return <Invitation cfg={configs.public} />;
}
