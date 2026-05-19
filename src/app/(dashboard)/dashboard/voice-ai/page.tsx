"use client"

import { useState, useMemo } from "react"
import { generateVoiceCalls } from "@/hooks/use-mock-data"
import type { VoiceCall } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectOption } from "@/components/ui/select"
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneForwarded,
  Play,
  Pause,
  SkipForward,
  Mic,
  MicOff,
  Clock,
  Calendar,
  FileText,
  Shield,
  AlertTriangle,
  Volume2,
  Settings,
  TrendingUp,
  Target,
  Zap,
  User,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Circle,
  Voicemail,
  Ban,
  Radio,
  BarChart3,
  MessageSquare,
} from "lucide-react"

const statusConfig: Record<VoiceCall["status"], { color: string; bg: string; label: string }> = {
  completed: { color: "text-green-700", bg: "bg-green-50 dark:bg-green-950", label: "Completed" },
  "no-answer": { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-800", label: "No Answer" },
  voicemail: { color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-950", label: "Voicemail" },
  busy: { color: "text-yellow-700", bg: "bg-yellow-50 dark:bg-yellow-950", label: "Busy" },
  failed: { color: "text-red-700", bg: "bg-red-50 dark:bg-red-950", label: "Failed" },
}

const sentimentConfig: Record<VoiceCall["sentiment"], { color: string; bg: string; dot: string; label: string }> = {
  positive: { color: "text-green-700", bg: "bg-green-50 dark:bg-green-950", dot: "bg-green-500", label: "Positive" },
  neutral: { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-800", dot: "bg-gray-400", label: "Neutral" },
  negative: { color: "text-red-700", bg: "bg-red-50 dark:bg-red-950", dot: "bg-red-500", label: "Negative" },
}

const outcomeLabels: Record<VoiceCall["outcome"], string> = {
  "meeting-booked": "Meeting Booked",
  callback: "Callback Requested",
  "not-interested": "Not Interested",
  "wrong-number": "Wrong Number",
  dnc: "Do Not Call",
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function VoiceAIPage() {
  const [calls] = useState<VoiceCall[]>(() => generateVoiceCalls())
  const [activeTab, setActiveTab] = useState("live")
  const [isCallingActive, setIsCallingActive] = useState(false)
  const [isQueuePaused, setIsQueuePaused] = useState(false)

  // Settings state
  const [selectedVoice, setSelectedVoice] = useState("professional-female")
  const [tcpaCompliance, setTcpaCompliance] = useState(true)
  const [dncSync, setDncSync] = useState(true)
  const [maxCallsPerDay, setMaxCallsPerDay] = useState("200")
  const [callingHoursStart, setCallingHoursStart] = useState("09:00")
  const [callingHoursEnd, setCallingHoursEnd] = useState("17:00")
  const [recordingConsent, setRecordingConsent] = useState(true)
  const [objectionHandling, setObjectionHandling] = useState("medium")
  const [meetingBooking, setMeetingBooking] = useState("standard")
  const [voicemailDrop, setVoicemailDrop] = useState(true)
  const [callScript, setCallScript] = useState(
    `Hi, this is [Your Name] calling from [Company]. I'm reaching out because I noticed your property at [Address] and wanted to see if you've considered any options for it.\n\nI work with investors and buyers who are actively looking in your area, and I thought there might be an opportunity here that could benefit you.\n\nWould you have a few minutes to chat about it?`
  )
  const [voicemailMessage, setVoicemailMessage] = useState(
    `Hi [Owner Name], this is [Your Name] from [Company]. I was calling about your property at [Address]. I'd love to discuss some options that might interest you. Please call me back at [Phone] when you have a chance. Thank you!`
  )

  // Queue leads mock
  const queueLeads = [
    { name: "Robert Chen", phone: "(555) 234-5678", score: 92 },
    { name: "Maria Garcia", phone: "(555) 345-6789", score: 87 },
    { name: "James Williams", phone: "(555) 456-7890", score: 84 },
    { name: "Patricia Brown", phone: "(555) 567-8901", score: 79 },
    { name: "David Martinez", phone: "(555) 678-9012", score: 76 },
  ]

  const stats = useMemo(() => {
    const completed = calls.filter((c) => c.status === "completed").length
    const totalDuration = calls.filter((c) => c.status === "completed").reduce((s, c) => s + c.duration, 0)
    const avgDuration = completed > 0 ? Math.floor(totalDuration / completed) : 0
    const meetings = calls.filter((c) => c.outcome === "meeting-booked").length
    return {
      totalToday: 47,
      connectRate: 67,
      avgDuration: "3:24",
      meetingsBooked: 8,
    }
  }, [calls])

  return (
    <div className="space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Voice AI Command Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            AI-powered calling with real-time sentiment analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <div className={`h-2 w-2 rounded-full ${isCallingActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
            {isCallingActive ? "System Active" : "System Idle"}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calls Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.totalToday}</p>
                <p className="text-xs text-green-600 mt-1">+12 vs yesterday</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Connect Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.connectRate}%</p>
                <p className="text-xs text-green-600 mt-1">Above average</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.avgDuration}</p>
                <p className="text-xs text-gray-400 mt-1">Target: 4:00</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Meetings Booked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-1">{stats.meetingsBooked}</p>
                <p className="text-xs text-green-600 mt-1">Best day this week</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="live">
            <Radio className="h-3.5 w-3.5 mr-1" /> Live Calls
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-3.5 w-3.5 mr-1" /> Call History
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-3.5 w-3.5 mr-1" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* ===== LIVE CALLS TAB ===== */}
        <TabsContent value="live">
          <div className="space-y-4 mt-4">
            {/* Start Calling */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className={isCallingActive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
                }
                onClick={() => setIsCallingActive(!isCallingActive)}
              >
                {isCallingActive ? (
                  <><PhoneOff className="h-5 w-5" /> Stop Calling</>
                ) : (
                  <><PhoneCall className="h-5 w-5" /> Start Calling</>
                )}
              </Button>
              <span className="text-sm text-gray-500">
                {isCallingActive ? "AI is actively making calls" : "Click to begin the calling session"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Active Call Card */}
              <Card className={isCallingActive ? "border-green-300 dark:border-green-700" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-green-600" />
                    Active Call
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isCallingActive ? (
                    <div className="space-y-4">
                      {/* Lead info */}
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-50">Sarah Johnson</p>
                          <p className="text-sm text-gray-500">(555) 123-4567</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-lg font-mono font-bold text-gray-900 dark:text-gray-50">2:34</p>
                          <p className="text-xs text-gray-400">Duration</p>
                        </div>
                      </div>

                      {/* Sentiment + Status */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">Positive Sentiment</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                          <Mic className="h-3 w-3 text-blue-600 animate-pulse" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">AI is speaking...</span>
                        </div>
                      </div>

                      {/* Transcript Preview */}
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                        <p className="text-xs text-gray-500 font-medium mb-1">Live Transcript</p>
                        <div className="space-y-1.5">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-blue-600">AI:</span> Hi Sarah, I&apos;m calling about your property on Oak Street. I work with investors looking in your area...
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-green-600">Sarah:</span> Oh yes, I&apos;ve been thinking about that actually. What kind of offers are you seeing?
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-blue-600">AI:</span> Great question! In your neighborhood, similar properties have been going for...
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <PhoneForwarded className="h-3.5 w-3.5" />
                          Transfer to Agent
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950">
                          <PhoneOff className="h-3.5 w-3.5" />
                          End Call
                        </Button>
                        <Button variant="outline" size="sm" className="text-orange-600 hover:text-orange-700 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950">
                          <Ban className="h-3.5 w-3.5" />
                          Mark DNC
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Phone className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No active call</p>
                      <p className="text-sm text-gray-400 mt-1">Start the calling session to begin</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Call Queue */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Call Queue
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsQueuePaused(!isQueuePaused)}
                      >
                        {isQueuePaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                        {isQueuePaused ? "Resume" : "Pause"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <SkipForward className="h-3.5 w-3.5" />
                        Skip
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {queueLeads.map((lead, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          idx === 0 && isCallingActive
                            ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
                            : "border-gray-100 dark:border-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                            idx === 0 && isCallingActive
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{lead.name}</p>
                            <p className="text-xs text-gray-500">{lead.phone}</p>
                          </div>
                        </div>
                        <Badge variant={lead.score >= 85 ? "success" : lead.score >= 75 ? "warning" : "secondary"}>
                          Score: {lead.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-3">Showing next 5 of 42 leads in queue</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ===== CALL HISTORY TAB ===== */}
        <TabsContent value="history">
          <div className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Lead</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Duration</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Sentiment</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Outcome</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Called</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calls.map((call) => {
                        const st = statusConfig[call.status]
                        const sent = sentimentConfig[call.sentiment]
                        return (
                          <tr key={call.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-50">{call.leadName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">{call.phone}</td>
                            <td className="px-4 py-3 font-mono text-gray-700 dark:text-gray-300">{formatDuration(call.duration)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>
                                {call.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                                {call.status === "no-answer" && <Circle className="h-3 w-3" />}
                                {call.status === "voicemail" && <Voicemail className="h-3 w-3" />}
                                {call.status === "busy" && <Phone className="h-3 w-3" />}
                                {call.status === "failed" && <XCircle className="h-3 w-3" />}
                                {st.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sent.bg} ${sent.color}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${sent.dot}`} />
                                {sent.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-gray-600 dark:text-gray-400">{outcomeLabels[call.outcome]}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{relativeTime(call.calledAt)}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Play Recording">
                                  <Play className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="View Transcript">
                                  <FileText className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== SETTINGS TAB ===== */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Voice Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Voice Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "professional-male", label: "Professional Male", desc: "Clear, authoritative tone" },
                  { id: "professional-female", label: "Professional Female", desc: "Confident, articulate delivery" },
                  { id: "warm-female", label: "Warm Female", desc: "Friendly, conversational style" },
                ].map((voice) => (
                  <div
                    key={voice.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedVoice === voice.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                        selectedVoice === voice.id ? "border-blue-500" : "border-gray-300"
                      }`}>
                        {selectedVoice === voice.id && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{voice.label}</p>
                        <p className="text-xs text-gray-500">{voice.desc}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="h-3.5 w-3.5" />
                      Sample
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Call Script */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Call Script Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={callScript}
                  onChange={(e) => setCallScript(e.target.value)}
                  className="w-full h-48 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 font-mono"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Use [Your Name], [Company], [Address], [Owner Name] as placeholders
                </p>
              </CardContent>
            </Card>

            {/* Compliance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Compliance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* TCPA */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">TCPA Compliance</p>
                    <p className="text-xs text-gray-500">Enforce TCPA calling regulations</p>
                  </div>
                  <button
                    onClick={() => setTcpaCompliance(!tcpaCompliance)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      tcpaCompliance ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      tcpaCompliance ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {/* DNC */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">DNC List Sync</p>
                    <p className="text-xs text-gray-500">Auto-sync with national DNC registry</p>
                  </div>
                  <button
                    onClick={() => setDncSync(!dncSync)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      dncSync ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      dncSync ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {/* Two-party consent warning */}
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Two-Party Consent States</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                        CA, CT, FL, IL, MD, MA, MI, MT, NV, NH, OR, PA, WA require consent from all parties before recording.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Max Calls */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">Max Calls Per Day</p>
                    <p className="text-xs text-gray-500">Limit daily outbound calls</p>
                  </div>
                  <Input
                    type="number"
                    value={maxCallsPerDay}
                    onChange={(e) => setMaxCallsPerDay(e.target.value)}
                    className="w-24 text-center"
                  />
                </div>

                {/* Calling Hours */}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-2">Calling Hours</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
                      <Input
                        type="time"
                        value={callingHoursStart}
                        onChange={(e) => setCallingHoursStart(e.target.value)}
                      />
                    </div>
                    <span className="text-gray-400 mt-5">to</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">End Time</label>
                      <Input
                        type="time"
                        value={callingHoursEnd}
                        onChange={(e) => setCallingHoursEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Recording Consent */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">Recording Consent Prompt</p>
                    <p className="text-xs text-gray-500">Play consent message at call start</p>
                  </div>
                  <button
                    onClick={() => setRecordingConsent(!recordingConsent)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      recordingConsent ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      recordingConsent ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* AI Behavior Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI Behavior Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Objection Handling */}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-2">Objection Handling Level</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["low", "medium", "aggressive"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setObjectionHandling(level)}
                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                          objectionHandling === level
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700"
                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {objectionHandling === "low" && "AI will politely accept objections and end the call."}
                    {objectionHandling === "medium" && "AI will address objections with one follow-up before accepting."}
                    {objectionHandling === "aggressive" && "AI will persistently address objections with multiple rebuttals."}
                  </p>
                </div>

                {/* Meeting Booking */}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mb-2">Meeting Booking Style</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["soft", "standard", "aggressive"] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setMeetingBooking(style)}
                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                          meetingBooking === style
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700"
                            : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {meetingBooking === "soft" && "AI will mention meeting possibility once without pushing."}
                    {meetingBooking === "standard" && "AI will suggest a meeting when interest is detected."}
                    {meetingBooking === "aggressive" && "AI will actively push for a meeting commitment."}
                  </p>
                </div>

                {/* Voicemail Drop */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">Voicemail Drop</p>
                      <p className="text-xs text-gray-500">Automatically leave a pre-recorded voicemail</p>
                    </div>
                    <button
                      onClick={() => setVoicemailDrop(!voicemailDrop)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        voicemailDrop ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                        voicemailDrop ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                  {voicemailDrop && (
                    <textarea
                      value={voicemailMessage}
                      onChange={(e) => setVoicemailMessage(e.target.value)}
                      className="w-full h-24 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 font-mono"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
