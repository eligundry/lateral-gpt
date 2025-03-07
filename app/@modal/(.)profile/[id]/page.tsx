import { getProfileById } from "@/lib/data"
import { ProfileDisplay } from "@/components/profile-display"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function InterceptedProfileModal({ params }: { params: { id: string } }) {
  try {
    const profile = await getProfileById(params.id)

    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{profile.full_name}</h2>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <ProfileDisplay profile={profile} isModal={true} />
        </DialogContent>
      </Dialog>
    )
  } catch (error) {
    notFound()
  }
}

