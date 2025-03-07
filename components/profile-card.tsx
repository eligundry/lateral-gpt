"use client"

import type { Document } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Linkedin } from "lucide-react"
import Link from "next/link"

interface ProfileCardProps {
  profile: Document
  onClick: () => void
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
          <img
            src={profile.profile_pic_url || "/placeholder.svg?height=80&width=80"}
            alt={profile.full_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=80&width=80"
            }}
          />
        </div>
        <h3 className="font-medium text-center">{profile.full_name}</h3>
        <p className="text-sm text-gray-600 text-center">{profile.title}</p>
        <p className="text-sm text-gray-600 text-center">{profile.school}</p>
        <p className="text-sm text-gray-600 text-center">{profile.city}</p>

        <div className="flex gap-2 mt-3 w-full">
          <Button variant="outline" className="flex-1" onClick={onClick}>
            View Profile
          </Button>

          <Link href={`/profile/${profile.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Share
            </Button>
          </Link>
        </div>

        {profile.linkedin && (
          <Link href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 w-full">
            <Button className="w-full bg-[#0077b5] hover:bg-[#0069a1] text-white flex items-center justify-center gap-2">
              <Linkedin className="w-4 h-4" />
              View LinkedIn
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

