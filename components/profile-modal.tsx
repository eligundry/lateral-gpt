"use client"

import type { Document } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProfileModalProps {
  profile: Document
  onClose: () => void
}

export function ProfileModal({ profile, onClose }: ProfileModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{profile.full_name}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-[1fr_2fr] gap-4">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-3">
              <img
                src={profile.profile_pic_url || "/placeholder.svg?height=128&width=128"}
                alt={profile.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=128&width=128"
                }}
              />
            </div>
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                LinkedIn Profile
              </a>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Position</h3>
              <p>
                {profile.title} at {profile.company_name}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact</h3>
              <p>{profile.email}</p>
              {profile.phone && <p>{profile.phone}</p>}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p>
                {profile.city}, {profile.country}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Education</h3>
              <p>{profile.school}</p>
              {profile.undergrad && (
                <p>
                  {profile.undergrad.degree_name}{" "}
                  {profile.undergrad.field_of_study && `in ${profile.undergrad.field_of_study}`}
                  {profile.undergrad.ends_at && ` (${profile.undergrad.ends_at.year})`}
                </p>
              )}
            </div>

            {profile.previous_companies && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Previous Companies</h3>
                <p>{profile.previous_companies}</p>
              </div>
            )}

            {profile.previous_titles && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Previous Titles</h3>
                <p>{profile.previous_titles}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

