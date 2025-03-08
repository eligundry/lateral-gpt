import { z } from "zod";

// Date schema
const DateSchema = z.object({
  month: z.number(),
  year: z.number(),
  day: z.number(),
});

// Undergrad schema
const UndergradSchema = z.object({
  school_facebook_profile_url: z.any(),
  starts_at: DateSchema.nullable().optional(),
  school: z.string().nullable().optional(),
  degree_name: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  grade: z.any(),
  activities_and_societies: z.any(),
  description: z.any(),
  ends_at: DateSchema.nullable().optional(),
  school_linkedin_profile_url: z.string().nullable().optional(),
  field_of_study: z.string().nullable().optional(),
});

// Current Company schema
const CurrentCompanySchema = z.object({
  starts_at: DateSchema.nullable().optional(),
  company_facebook_profile_url: z.any(),
  logo_url: z.string().nullable().optional(),
  company_linkedin_profile_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  ends_at: DateSchema.nullable().optional(),
  title: z.string().nullable().optional(),
});

// Document schema
export const DocumentSchema = z.object({
  id: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  alumni: z.boolean(),
  phone: z.string().nullable().optional(),
  company_name: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  club_id: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  school: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  previous_companies: z.string().nullable().optional(),
  undergrad: UndergradSchema.nullable().optional(),
  current_company: CurrentCompanySchema.nullable().optional(),
  profile_pic_url: z.string().nullable().optional(),
  previous_titles: z.string().nullable().optional(),
});

// Result schema
export const ResultSchema = z.object({
  id: z.string().nullable().optional(),
  document: DocumentSchema,
});

// Response schema
export const ResponseSchema = z.object({
  page_num: z.number(),
  num_pages: z.number(),
  num_items: z.number(),
  num_items_on_page: z.number(),
  results: z.array(ResultSchema),
});

// Education schema for full user data
export const EducationSchema = z.object({
  school_facebook_profile_url: z.any(),
  starts_at: DateSchema,
  school: z.string().nullable().optional(),
  degree_name: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  grade: z.any(),
  activities_and_societies: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  ends_at: DateSchema.nullable(),
  school_linkedin_profile_url: z.string().nullable().optional(),
  field_of_study: z.string().nullable().optional(),
});

// People Also Viewed schema
export const PeopleAlsoViewedSchema = z.object({
  summary: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  location: z.any(),
});

// Volunteer Work schema
export const VolunteerWorkSchema = z.object({
  starts_at: DateSchema,
  logo_url: z.string().nullable().optional(),
  company_linkedin_profile_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  cause: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  ends_at: DateSchema,
  title: z.string().nullable().optional(),
});

// Group schema
export const GroupSchema = z.object({
  name: z.string().nullable().optional(),
  profile_pic_url: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
});

// Experience schema
export const ExperienceSchema = z.object({
  starts_at: DateSchema,
  company_facebook_profile_url: z.any(),
  logo_url: z.string().nullable().optional(),
  company_linkedin_profile_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  ends_at: DateSchema.nullable().optional(),
  title: z.string().nullable().optional(),
});

// Full User Item schema
export const FullUserItemSchema = z.object({
  accomplishment_patents: z.array(z.any()),
  country: z.string().nullable().optional(),
  education: z.array(EducationSchema),
  occupation: z.string().nullable().optional(),
  gender: z.any(),
  city: z.string().nullable().optional(),
  people_also_viewed: z.array(PeopleAlsoViewedSchema),
  birth_date: z.any(),
  inferred_salary: z.any(),
  background_cover_image_url: z.string().nullable().optional(),
  industry: z.any(),
  linkedin: z.string().nullable().optional(),
  recommendations: z.array(z.any()),
  follower_count: z.number(),
  skills: z.array(z.any()),
  cover_pic_url: z.string().nullable().optional(),
  accomplishment_publications: z.array(z.any()),
  extra: z.any(),
  personal_numbers: z.array(z.any()),
  state: z.string().nullable().optional(),
  volunteer_work: z.array(VolunteerWorkSchema),
  first_name: z.string().nullable().optional(),
  profile_pic_url: z.string().nullable().optional(),
  public_identifier: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  connections: z.number(),
  summary: z.string().nullable().optional(),
  similarly_named_profiles: z.array(z.any()),
  languages: z.array(z.any()),
  accomplishment_courses: z.array(z.any()),
  last_name: z.string().nullable().optional(),
  groups: z.array(GroupSchema),
  certifications: z.array(z.any()),
  experiences: z.array(ExperienceSchema),
  country_full_name: z.string().nullable().optional(),
  full_name: z.string().nullable().optional(),
  accomplishment_organisations: z.array(z.any()),
  activities: z.array(z.any()),
  personal_emails: z.array(z.any()),
  accomplishment_test_scores: z.array(z.any()),
  interests: z.array(z.any()),
  articles: z.array(z.any()),
  accomplishment_projects: z.array(z.any()),
  accomplishment_honors_awards: z.array(z.any()),
});

// Full User Results schema
export const FullUserResultsSchema = z.object({
  num_items: z.number(),
  results: z.record(z.string(), z.object({ linkedin: FullUserItemSchema })),
});

// Export types
export type Date = z.infer<typeof DateSchema>;
export type Undergrad = z.infer<typeof UndergradSchema>;
export type CurrentCompany = z.infer<typeof CurrentCompanySchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type Result = z.infer<typeof ResultSchema>;
export type Response = z.infer<typeof ResponseSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type PeopleAlsoViewed = z.infer<typeof PeopleAlsoViewedSchema>;
export type VolunteerWork = z.infer<typeof VolunteerWorkSchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type FullUserItem = z.infer<typeof FullUserItemSchema>;
export type FullUserResults = z.infer<typeof FullUserResultsSchema>;
