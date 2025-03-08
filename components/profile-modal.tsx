"use client";

import type { FullUserItem } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProfileDisplay } from "@/components/profile-display";
import { usePathname } from "next/navigation";

interface ProfileModalProps {
  profile: FullUserItem;
}

export function ProfileModal({ profile }: ProfileModalProps) {
  const pathname = usePathname();
  return (
    <Dialog open={pathname.startsWith("/profile")}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        closeHref="/"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            {profile.full_name}
          </DialogTitle>
        </div>

        <ProfileDisplay profile={profile} isModal={true} />
      </DialogContent>
    </Dialog>
  );
}
