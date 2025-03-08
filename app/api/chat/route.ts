import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { ResponseSchema } from "@/lib/types";
import { z } from "zod";

// Define the search parameters schema using Zod
const searchParamsSchema = z.object({
  name: z
    .string()
    .describe("Name of a user (partial match to full name)")
    .optional(),
  current_company: z
    .string()
    .describe("Name of the current company for a user")
    .optional(),
  sector: z
    .enum(["CONSULTING", "FINANCE"])
    .describe("The sector the user is in (CONSULTING or FINANCE)")
    .optional(),
  previous_company: z
    .string()
    .describe("The name of the previous company for a user")
    .optional(),
  title: z
    .string()
    .describe("The title of the user (i.e., Associate, Vice President, etc.)")
    .optional(),
  role: z
    .string()
    .describe("The role that the user has now or has had in the past")
    .optional(),
  school: z
    .union([
      z.string().describe("The school of the user"),
      z.array(z.string()).describe("List of schools the user attended"),
    ])
    .optional(),
  undergraduate_year: z
    .string()
    .describe("The graduation year for the user for their undergraduate degree")
    .optional(),
  city: z.string().describe("The city of the user").optional(),
  page: z.number().describe("The page number (defaults to 1)").optional(),
  count: z
    .number()
    .describe("The number of items to be displayed per page (defaults to 20)")
    .optional(),
});

// Create the tool using Vercel's tool function
const searchLateralRecruits = tool({
  description: "Search for lateral recruits based on various criteria",
  parameters: searchParamsSchema,

  execute: async (args) => {
    console.log("Searching for lateral recruits with args:", args);

    const url = new URL(
      "https://dev-dot-recruit-u-f79a8.uc.r.appspot.com/api/lateral-recruiting",
    );

    // Add all provided parameters to the URL
    Object.entries(args).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) =>
            url.searchParams.append(key, item.toString()),
          );
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });

    // Make the API request
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Validate the response with Zod
    try {
      const validatedData = ResponseSchema.parse(data);
      // Extract just the document data for the UI
      return validatedData.results.map((result) => result.document);
    } catch (error) {
      console.error("Response validation error:", error);
      throw new Error("Invalid API response format");
    }
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are an AI assistant for lateral recruiting professionals helping find promising candidates based on criteria.

Current date: ${new Date().toLocaleDateString()}

CAPABILITIES:
- Search candidates by name, current company, past company, sector, title, role, education, location, etc.
- Understand time references (e.g., "next year" = ${new Date().getFullYear() + 1})
- Provide concise result summaries
- Expand school groups and geographic regions
- Handle paginated results

LIMITATIONS:
- Only CONSULTING and FINANCE sectors are supported. If user asks about other sectors (tech, healthcare, etc.), immediately inform them these sectors aren't available yet.

INSTRUCTIONS:
1. Use searchLateralRecruits tool for candidate searches.

2. Parameter mapping:
   - Education: "school", "undergraduate_year"
   - Industry: "sector" (CONSULTING/FINANCE only), "current_company", "previous_company"
   - Position: "title" (position), "role" (function)
   - Location: "city"
   - Pagination: "page" (defaults to 1), "count" (defaults to 20)

3. Expand colloquial references:
   - College groups: Expand NCAA conferences and academic groupings into member schools
     Example: "Ivy League" → Harvard, Yale, Princeton, Columbia, Brown, Dartmouth, Cornell, UPenn

   - Geographic regions/abbreviations: Expand regions into cities and abbreviations into full names
     Examples:
     • "Northeast" → New York, Boston, Philadelphia, DC, Pittsburgh
     • "NYC" → "New York City", "LA" → "Los Angeles", "SF" → "San Francisco", "DC" → "Washington"

4. Handling pagination:
   - Results are paginated with 20 results per page by default
   - When initial search returns results, inform the user about the total count
   - If there are more results than shown on the first page, offer to show more
   - When user asks for more results, make the same search with incremented page parameter
   - Keep track of which page you're on and how many total results exist
   - Example: "I found 45 candidates. Showing page 1 (20 results). Would you like to see more?"

5. For search results:
   - Summarize findings or suggest broader criteria if none found
   - Format results clearly
   - Suggest refinement parameters
   - Indicate current page and total pages when displaying results

EXAMPLES:
- "Find Harvard students in finance graduating next year" → school=Harvard, sector=FINANCE, undergraduate_year=2026
- "Find Ivy League graduates in consulting" → school=["Harvard", "Yale", "Princeton", "Columbia", "Brown", "Dartmouth", "Cornell", "UPenn"], sector=CONSULTING
- "Find finance professionals in NYC" → sector=FINANCE, city="New York City"
- "Show me more results" → Repeat previous search with page=2

Maintain a professional, helpful tone focused on efficient candidate discovery.`,
      },
      ...messages,
    ],
    tools: { searchLateralRecruits },
  });

  return result.toDataStreamResponse();
}
