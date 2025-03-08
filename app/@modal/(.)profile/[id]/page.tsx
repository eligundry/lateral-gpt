import { getProfileById } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProfileModal } from "@/components/profile-modal";

export default async function InterceptedProfileModal({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  console.log("intercepted modal", params);

  if (!params?.id) {
    return null;
  }

  try {
    const profile = await getProfileById(params.id);

    return <ProfileModal profile={profile} />;
  } catch (error) {
    notFound();
  }
}
