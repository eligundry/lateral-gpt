import type { FullUserItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Linkedin,
  Briefcase,
  GraduationCap,
  MapPin,
  Users,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfileDisplayProps {
  profile: FullUserItem;
  isModal?: boolean;
}

export function ProfileDisplay({
  profile,
  isModal = false,
}: ProfileDisplayProps) {
  console.log({ profile });

  // If it's a modal, show a condensed version
  if (isModal) {
    return (
      <div className="grid grid-cols-[1fr_2fr] gap-6 mt-4">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-3">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={profile.profile_pic_url ?? undefined}
                alt={profile.full_name ?? undefined}
                className="object-cover"
              />
              <AvatarFallback>
                {profile.first_name?.[0]} {profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
            <MapPin className="w-3 h-3" />
            <span>
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <Users className="w-3 h-3" />
            <span>{profile.connections.toLocaleString()} connections</span>
          </div>

          {profile.linkedin && (
            <Link
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-[#0077b5] hover:bg-[#0069a1] text-white flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                View LinkedIn
              </Button>
            </Link>
          )}

          {profile.id && (
            <Link
              href={`/profile/${profile.id}`}
              className="w-full mt-2"
              prefetch={false}
              target="_blank"
            >
              <Button variant="outline" className="w-full">
                Full Profile
              </Button>
            </Link>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Headline</h3>
            <p>{profile.headline}</p>
          </div>

          {profile.summary && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Summary</h3>
              <p className="text-sm">{profile.summary}</p>
            </div>
          )}

          {/* Experience */}
          {profile.experiences && profile.experiences.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Experience
              </h3>
              <div className="space-y-3 mt-2">
                {profile.experiences.slice(0, 3).map((exp, index) => (
                  <div key={index}>
                    <p className="font-medium">{exp.title}</p>
                    <p className="text-sm">{exp.company}</p>
                    <p className="text-xs text-gray-500">
                      {exp.starts_at
                        ? `${exp.starts_at.month}/${exp.starts_at.year}`
                        : ""}{" "}
                      -
                      {exp.ends_at
                        ? ` ${exp.ends_at.month}/${exp.ends_at.year}`
                        : " Present"}
                    </p>
                  </div>
                ))}
                {profile.experiences.length > 3 && (
                  <p className="text-xs text-primary">
                    +{profile.experiences.length - 3} more experiences
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <GraduationCap className="w-4 h-4 mr-1" />
                Education
              </h3>
              <div className="space-y-3 mt-2">
                {profile.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-medium">{edu.school}</p>
                    <p className="text-sm">
                      {edu.degree_name}{" "}
                      {edu.field_of_study && `in ${edu.field_of_study}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {edu.starts_at
                        ? `${edu.starts_at.month}/${edu.starts_at.year}`
                        : ""}{" "}
                      -
                      {edu.ends_at
                        ? ` ${edu.ends_at.month}/${edu.ends_at.year}`
                        : " Present"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full profile display
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
      {/* Cover Image */}
      <div className="h-48 bg-gray-200 relative">
        <div className="w-full h-full">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage
              src={profile.background_cover_image_url ?? undefined}
              alt="Cover"
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="bg-primary rounded-none" />
          </Avatar>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-8 pt-6 pb-4 flex flex-col md:flex-row gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white -mt-16 relative z-10 mx-auto md:mx-0">
          <Avatar className="w-full h-full">
            <AvatarImage
              src={profile.profile_pic_url ?? undefined}
              alt={profile.full_name ?? undefined}
              className="object-cover w-full h-full"
            />
            <AvatarFallback className="text-2xl">
              {profile.first_name?.[0]} {profile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <p className="text-gray-600">{profile.headline}</p>

          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {[profile.city, profile.state].filter(Boolean).join(", ")}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {profile.connections.toLocaleString()} connections
            </span>
          </div>

          {profile.linkedin && (
            <Link
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block"
            >
              <Button className="bg-[#0077b5] hover:bg-[#0069a1] text-white flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                View LinkedIn Profile
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-8 py-6 border-t">
        {profile.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {profile.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {profile.experiences && profile.experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-gray-600" />
              Experience
            </h2>

            <div className="space-y-6">
              {profile.experiences.map((exp, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={exp.logo_url || undefined}
                        alt={exp.company ?? undefined}
                        className="object-contain"
                      />
                      <AvatarFallback>{exp.company?.[0] || "C"}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <h3 className="font-medium">{exp.title}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.starts_at
                        ? `${exp.starts_at.month}/${exp.starts_at.year}`
                        : ""}{" "}
                      -
                      {exp.ends_at
                        ? ` ${exp.ends_at.month}/${exp.ends_at.year}`
                        : " Present"}
                    </p>
                    <p className="text-sm text-gray-500">{exp.location}</p>

                    {exp.description && (
                      <p className="mt-2 text-gray-700">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-gray-600" />
              Education
            </h2>

            <div className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={edu.logo_url || undefined}
                        alt={edu.school ?? undefined}
                        className="object-contain"
                      />
                      <AvatarFallback>{edu.school?.[0] || "S"}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <h3 className="font-medium">{edu.school}</h3>
                    <p className="text-gray-600">
                      {edu.degree_name}{" "}
                      {edu.field_of_study && `in ${edu.field_of_study}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {edu.starts_at
                        ? `${edu.starts_at.month}/${edu.starts_at.year}`
                        : ""}{" "}
                      -
                      {edu.ends_at
                        ? ` ${edu.ends_at.month}/${edu.ends_at.year}`
                        : " Present"}
                    </p>

                    {edu.activities_and_societies && (
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">
                          Activities and Societies:
                        </span>{" "}
                        {edu.activities_and_societies}
                      </p>
                    )}

                    {edu.description && (
                      <p className="mt-2 text-gray-700">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Work */}
        {profile.volunteer_work && profile.volunteer_work.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-gray-600" />
              Volunteer Experience
            </h2>

            <div className="space-y-6">
              {profile.volunteer_work.map((vol, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={vol.logo_url || undefined}
                        alt={vol.company ?? undefined}
                        className="object-contain"
                      />
                      <AvatarFallback>{vol.company?.[0] || "V"}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <h3 className="font-medium">{vol.title}</h3>
                    <p className="text-gray-600">
                      {[vol.company, vol.cause].filter(Boolean).join(" • ")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {vol.starts_at
                        ? `${vol.starts_at.month}/${vol.starts_at.year}`
                        : ""}{" "}
                      -
                      {vol.ends_at
                        ? ` ${vol.ends_at.month}/${vol.ends_at.year}`
                        : " Present"}
                    </p>

                    {vol.description && (
                      <p className="mt-2 text-gray-700">{vol.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
