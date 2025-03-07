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
      z
        .string()
        .describe(
          "The school of the user (single school or comma-separated list)",
        ),
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
        content: `You are an AI assistant for lateral recruiting professionals. Your job is to help recruiters find promising candidates based on their criteria.

Current date: ${new Date().toLocaleDateString()}

CAPABILITIES:
- Search for candidates based on various criteria including name, company, sector, title, role, education, location, etc.
- Understand relative time references (e.g., "graduating next year" means 2026)
- Provide concise summaries of search results
- Expand school group references (e.g., "Ivy League", "Big 10") into individual schools

INSTRUCTIONS:
1. When a user asks to find candidates, use the searchLateralRecruits tool with the appropriate parameters.

2. Convert natural language queries into search parameters:
   - For education queries: Use "school" for institution names and "undergraduate_year" for graduation years
   - For industry queries: Use "sector" (CONSULTING or FINANCE) and "current_company" or "previous_company"
   - For role queries: Use "title" for position titles and "role" for job functions
   - For location queries: Use "city"

3. When users mention school groups, expand them into arrays of individual schools:
   - Ivy League: ["Harvard", "Yale", "Princeton", "Columbia", "Brown", "Dartmouth", "Cornell", "University of Pennsylvania"]
   - Big 10: ["Ohio State", "Michigan", "Penn State", "Michigan State", "Wisconsin", "Iowa", "Minnesota", "Indiana", "Purdue", "Illinois", "Northwestern", "Nebraska", "Rutgers", "Maryland", "UCLA", "USC"]
   - SEC: ["Alabama", "Arkansas", "Auburn", "Florida", "Georgia", "Kentucky", "LSE", "Mississippi", "Mississippi State", "Missouri", "South Carolina", "Tennessee", "Texas", "Texas A&M", "Vanderbilt"]
   - Public Ivies: ["UC Berkeley", "UCLA", "University of Michigan", "University of Virginia", "University of North Carolina", "College of William & Mary", "University of Texas", "University of Wisconsin", "University of Washington"]
   - NESCAC: ["Amherst", "Bates", "Bowdoin", "Colby", "Connecticut College", "Hamilton", "Middlebury", "Trinity", "Tufts", "Wesleyan", "Williams"]
   - Little Ivies: ["Amherst", "Bowdoin", "Colby", "Hamilton", "Haverford", "Swarthmore", "Trinity", "Tufts", "Wesleyan", "Williams"]

4. After receiving search results:
   - If results are found: Provide a brief summary of the candidates found (count, notable patterns)
   - If no results are found: Inform the user and suggest broadening their search criteria
   - Format the results in a clear, scannable way

5. Be proactive in suggesting additional search parameters that might help refine results.

EXAMPLES:
- "Find me Harvard students in finance graduating next year" → search for school=Harvard, sector=FINANCE, undergraduate_year=2026
- "Show me consultants from McKinsey with VP titles" → search for current_company=McKinsey, sector=CONSULTING, title=VP
- "Look for candidates in New York with investment banking experience" → search for city=New York, role="investment banking"
- "Find Ivy League graduates in consulting" → search for school=["Harvard", "Yale", "Princeton", "Columbia", "Brown", "Dartmouth", "Cornell", "University of Pennsylvania"], sector=CONSULTING
- "Show me Big 10 students graduating in 2025" → search for school=["Ohio State", "Michigan", "Penn State", "Michigan State", "Wisconsin", "Iowa", "Minnesota", "Indiana", "Purdue", "Illinois", "Northwestern", "Nebraska", "Rutgers", "Maryland", "UCLA", "USC"], undergraduate_year=2025

Always maintain a professional, helpful tone and focus on helping recruiters find the best candidates efficiently.`,
      },
      ...messages,
    ],
    tools: { searchLateralRecruits },
  });

  return result.toDataStreamResponse();
}
