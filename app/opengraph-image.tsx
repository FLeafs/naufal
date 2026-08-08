import { config } from "./config";
import { createSocialImage, socialImageSize } from "./lib/social-image";

export const alt = `The Wedding of ${config.couple.brideShort} & ${config.couple.groomShort}`;
export const size = socialImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage(config);
}
