import { type FullUserItem, FullUserResultsSchema } from "@/lib/types";

/**
 * Fetches detailed profile data for a specific user ID
 */
export async function getProfileById(id: string): Promise<FullUserItem> {
  if (!id) {
    throw new Error("Profile ID is required");
  }

  try {
    // Fetch full user data from the API
    const url = `https://dev-dot-recruit-u-f79a8.uc.r.appspot.com/api/lateral-recruiting/people/search?ids=[${id}]`;
    const response = await fetch(url, { cache: "force-cache" }); // Cache for 1 hour

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(data.results[id].linkedin.people_also_viewed);

    // Validate the response with Zod
    const validatedData = FullUserResultsSchema.parse(data);

    // Extract the user data from the results
    if (!validatedData.results[id]) {
      throw new Error("Profile not found");
    }

    return validatedData.results[id].linkedin;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}
