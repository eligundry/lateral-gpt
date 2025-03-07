"use client"

import { useState, useRef } from "react"
import { useChat } from "ai/react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/profile-card"
import { ProfileModal } from "@/components/profile-modal"
import type { Document } from "@/lib/types"

export default function Home() {
  const [selectedProfile, setSelectedProfile] = useState<Document | null>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop } = useChat({
    api: "/api/chat",
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleNewChat = () => {
    window.location.reload()
  }

  const profiles = messages
    .filter((message) => message.role === "assistant")
    .flatMap((message) => {
      try {
        const content = JSON.parse(message.content)
        return Array.isArray(content) ? content : []
      } catch (e) {
        return []
      }
    })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-primary">LateralGPT</h1>
          <Button onClick={handleNewChat} variant="outline" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            New Chat
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col h-[calc(100vh-64px)]">
        <div className="container mx-auto w-[60%] flex flex-col h-full">
          {/* Messages - Scrollable area */}
          <div className="flex-1 overflow-y-auto py-8 pb-4">
            <div className="space-y-4 mb-6">
              {messages.map((message) => {
                if (message.role === "user") {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="bg-primary text-white p-3 rounded-lg max-w-[80%]">{message.content}</div>
                    </div>
                  )
                }

                // Skip rendering JSON messages directly
                if (message.content.startsWith("[") || message.content.startsWith("{")) {
                  return null
                }

                return (
                  <div key={message.id} className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">{message.content}</div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Cards */}
            {profiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {profiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} onClick={() => setSelectedProfile(profile)} />
                ))}
              </div>
            )}
          </div>

          {/* Chat Input - Sticky to bottom */}
          <div className="sticky bottom-0 bg-white py-4 border-t">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative border rounded-md focus-within:ring-2 focus-within:ring-primary">
                <textarea
                  className="w-full p-3 overflow-hidden focus:outline-none min-h-[60px] max-h-[200px] resize-none field-sizing-content"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Find me Harvard business grads that graduate next year..."
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim() && !isLoading) {
                        handleSubmit(e as any)
                      }
                    }
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  Send
                </Button>
                {isLoading && (
                  <Button type="button" variant="outline" onClick={stop}>
                    Stop
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {selectedProfile && <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
    </div>
  )
}

