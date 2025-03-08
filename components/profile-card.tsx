"use client";

import type { Document } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin } from "lucide-react";
import Link from "next/link";

interface ProfileCardProps {
  profile: Document;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col items-center">
        <Avatar className="w-20 h-20 mb-3">
          <AvatarImage
            src={profile.profile_pic_url || undefined}
            alt={profile.full_name ?? undefined}
            className="object-cover"
          />
          <AvatarFallback>
            {profile.full_name
              ? profile.full_name
                .split(" ")
                .map((name) => name[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()
              : "NA"}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-medium text-center">{profile.full_name}</h3>
        {profile.title && (
          <p className="text-sm text-gray-600 text-center">
            {[profile.title, profile.current_company?.company]
              .filter(Boolean)
              .join(" at ")}
          </p>
        )}
        <p className="text-sm text-gray-600 text-center">{profile.school}</p>
        <p className="text-sm text-gray-600 text-center">{profile.city}</p>

        <div className="flex gap-2 mt-3 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/profile/${profile.id}`}>View Profile</Link>
          </Button>
        </div>

        {profile.linkedin && (
          <Link
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full"
          >
            <Button className="w-full bg-[#0077b5] hover:bg-[#0069a1] text-white flex items-center justify-center gap-2">
              <Linkedin className="w-4 h-4" />
              View LinkedIn
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
