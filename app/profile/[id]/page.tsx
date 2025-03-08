import { getProfileById } from "@/lib/data";
import { ProfileDisplay } from "@/components/profile-display";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  try {
    const profile = await getProfileById(params.id);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-white">
          <div className="container flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary">LateralGPT</h1>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
        </header>

        <main className="container py-8">
          <ProfileDisplay profile={profile} />
        </main>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await paramsPromise;
  try {
    const profile = await getProfileById(params.id);
    return {
      title: `${profile.full_name} | LateralGPT`,
      description:
        profile.headline ||
        `View ${profile.full_name}'s professional profile on LateralGPT`,
    };
  } catch (error) {
    return {
      title: "Profile | LateralGPT",
      description: "View professional profile on LateralGPT",
    };
  }
}
