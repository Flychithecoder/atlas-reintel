"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Sparkles, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AtlasChatContext {
  currentPage?: string
  selectedLead?: {
    name: string
    address: string
    score: number
    signals: string[]
    status: string
    propertyType: string
    estimatedValue: number
    market: string
  }
  activeMarket?: string
}

interface AtlasChatProps {
  open: boolean
  onClose: () => void
  context?: AtlasChatContext
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useAtlasChat() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const close = useCallback(() => setIsOpen(false), [])
  const openChat = useCallback(() => setIsOpen(true), [])

  return { isOpen, toggle, close, openChat, setIsOpen }
}

// ── Component ──────────────────────────────────────────────────────────────

export function AtlasChat({ open, onClose, context }: AtlasChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when drawer opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const clearChat = useCallback(() => {
    setMessages([])
    setInput('')
  }, [])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsStreaming(true)

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, context }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }))
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: err.error || 'Something went wrong. Please try again.' }
              : m
          )
        )
        setIsStreaming(false)
        return
      }

      const contentType = response.headers.get('content-type') || ''

      // Non-streaming response (mock / unconfigured)
      if (contentType.includes('application/json')) {
        const data = await response.json()
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: data.message || data.error || 'No response.' }
              : m
          )
        )
        setIsStreaming(false)
        return
      }

      // Streaming SSE response
      const reader = response.body?.getReader()
      if (!reader) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: 'Failed to read response stream.' }
              : m
          )
        )
        setIsStreaming(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                accumulated += parsed.text
                const snapshot = accumulated
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: snapshot }
                      : m
                  )
                )
              }
              if (parsed.error) {
                accumulated += `\n\n[Error: ${parsed.error}]`
                const snapshot = accumulated
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: snapshot }
                      : m
                  )
                )
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      }
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Network error'
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: `Connection failed: ${errorText}. Please try again.` }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }, [input, isStreaming, messages, context])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity lg:bg-black/20"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px] lg:w-[460px]',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Atlas AI</h2>
              <p className="text-[11px] text-gray-500">Real estate intelligence assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
                title="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Context badge ──────────────────────────────────────── */}
        {context?.selectedLead && (
          <div className="border-b border-gray-800 px-4 py-2">
            <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="truncate text-xs text-gray-400">
                Viewing: {context.selectedLead.name} &mdash; {context.selectedLead.address}
              </span>
            </div>
          </div>
        )}

        {/* ── Messages ───────────────────────────────────────────── */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={
                    isStreaming &&
                    message.role === 'assistant' &&
                    message.id === messages[messages.length - 1]?.id
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Input ──────────────────────────────────────────────── */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-end gap-2 rounded-xl bg-gray-800 p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Atlas AI anything..."
              rows={1}
              disabled={isStreaming}
              className="max-h-32 min-h-[36px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-white placeholder-gray-500 outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                input.trim() && !isStreaming
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-600'
              )}
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-gray-600">
            Powered by Atlas AI &middot; Responses may not be accurate
          </p>
        </div>
      </aside>
    </>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10">
        <Sparkles className="h-7 w-7 text-blue-500" />
      </div>
      <h3 className="text-base font-semibold text-white">Atlas AI</h3>
      <p className="mt-1.5 text-sm text-gray-400">
        Your real estate intelligence assistant. Ask about leads, markets, property analysis, or deal strategy.
      </p>
      <div className="mt-6 space-y-2 w-full max-w-xs">
        {[
          'Analyze this lead\'s motivation to sell',
          'What signals should I prioritize?',
          'Draft a listing pitch for this property',
          'Explain CONFOTUR tax benefits',
        ].map((suggestion) => (
          <button
            key={suggestion}
            className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:border-gray-600 hover:bg-gray-800"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage
  isStreaming: boolean
}) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-200'
        )}
      >
        {/* Streaming cursor */}
        {isStreaming && !message.content ? (
          <div className="flex items-center gap-1.5 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 [animation-delay:150ms]" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 [animation-delay:300ms]" />
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}

        {/* Streaming indicator */}
        {isStreaming && message.content && (
          <span className="ml-0.5 inline-block h-3.5 w-1 animate-pulse bg-blue-400" />
        )}
      </div>
    </div>
  )
}
