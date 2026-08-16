import { Invitation } from "../components/invitation";
import { configs } from "../config";

/**
 * Catch-all: semua path selain /qnet (mis. /undangan, /apa-saja)
 * menampilkan undangan mode PUBLIC.
 */
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const isFrens = slug.length === 1 && slug[0] === "frens";

  return (
    <Invitation
      cfg={configs.public}
      coupleTitle={isFrens ? "The Couple" : undefined}
      showParents={!isFrens}
    />
  );
}
