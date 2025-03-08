import { ProfileCard } from "@/components/profile-card";
import type { Document } from "@/lib/types";
import { Message as AIMessage } from "@ai-sdk/react";

interface MessageProps {
  message: AIMessage;
}

interface SearchResultsProps {
  results: any[];
}

function SearchResults({ results }: SearchResultsProps) {
  if (!Array.isArray(results)) {
    return (
      <div className="flex justify-start">
        <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
          Unable to process search results.
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex justify-start">
        <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
          No results found for your search.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {results.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}

export function Message({ message }: MessageProps) {
  // User message
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-white p-3 rounded-lg max-w-[80%]">
          {message.content}
        </div>
      </div>
    );
  }

  // Skip rendering JSON messages directly
  if (message.content.startsWith("[") || message.content.startsWith("{")) {
    return null;
  }

  // Handle tool invocations for searchLateralRecruits
  if (message.role === "assistant" && "parts" in message) {
    const searchCalls = message.parts.filter(
      (call) =>
        "toolInvocation" in call &&
        call.toolInvocation.toolName === "searchLateralRecruits" &&
        "result" in call.toolInvocation,
    );

    if (
      searchCalls &&
      searchCalls.length > 0 &&
      "toolInvocation" in searchCalls[0]
    ) {
      // Collect all results into a single array
      const allResults = searchCalls.reduce((acc, call) => {
        if (!("toolInvocation" in call) || !("result" in call.toolInvocation)) {
          return acc;
        }

        // Add all results from this call to the accumulator
        if (Array.isArray(call.toolInvocation.result)) {
          return [...acc, ...call.toolInvocation.result];
        }

        return acc;
      }, [] as any[]);

      // Deduplicate results by ID
      const uniqueResults = Array.from(
        new Map(allResults.map((item) => [item.id, item])).values(),
      );

      // Return a single SearchResults component with all unique results
      return (
        <SearchResults key="combined-search-results" results={uniqueResults} />
      );
    }
  }

  // Default assistant message
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
        {message.content}
      </div>
    </div>
  );
}
