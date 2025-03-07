import { type FullUserItem, FullUserResultsSchema } from "@/lib/types"

/**
 * Fetches detailed profile data for a specific user ID
 */
export async function getProfileById(id: string): Promise<FullUserItem> {
  if (!id) {
    throw new Error("Profile ID is required")
  }

  try {
    // Fetch full user data from the API
    const url = `https://dev-dot-recruit-u-f79a8.uc.r.appspot.com/api/lateral-recruiting/people/search?ids=[${id}]`
    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Validate the response with Zod
    const validatedData = FullUserResultsSchema.parse(data)

    // Extract the user data from the results
    if (validatedData.results.length === 0 || !validatedData.results[0][id]) {
      throw new Error("Profile not found")
    }

    return validatedData.results[0][id]
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}

