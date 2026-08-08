import { configs } from "../config";
import { createSocialImage, socialImageSize } from "../lib/social-image";

const cfg = configs.qnet;

export const alt = `The Wedding of ${cfg.couple.brideShort} & ${cfg.couple.groomShort}`;
export const size = socialImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage(cfg);
}
