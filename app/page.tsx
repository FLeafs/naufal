import { Invitation } from "./components/invitation";
import { configs } from "./config";

/* Mode PUBLIC — 23 Agustus 2026, mulai 10.00 WIB */
export default function Home() {
  return <Invitation cfg={configs.public} />;
}
