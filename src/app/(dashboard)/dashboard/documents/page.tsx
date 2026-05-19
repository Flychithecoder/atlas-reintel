"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileText,
  File,
  Image as ImageIcon,
  CheckCircle,
  Loader2,
  XCircle,
  Eye,
  Download,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react"

interface MockDocument {
  id: string
  name: string
  type: "OM" | "Rent Roll" | "Lease Abstract" | "P&L" | "Appraisal"
  uploadedAt: string
  status: "Parsed" | "Processing" | "Failed"
  pages: number
}

const mockDocuments: MockDocument[] = [
  { id: "1", name: "123 Main St - Offering Memorandum.pdf", type: "OM", uploadedAt: "2026-05-19", status: "Parsed", pages: 42 },
  { id: "2", name: "456 Oak Ave - Rent Roll Q1 2026.xlsx", type: "Rent Roll", uploadedAt: "2026-05-18", status: "Parsed", pages: 3 },
  { id: "3", name: "789 Broadway - Lease Abstract.pdf", type: "Lease Abstract", uploadedAt: "2026-05-18", status: "Processing", pages: 18 },
  { id: "4", name: "Westfield Plaza - P&L 2025.pdf", type: "P&L", uploadedAt: "2026-05-17", status: "Parsed", pages: 12 },
  { id: "5", name: "Harbor View Apts - Appraisal.pdf", type: "Appraisal", uploadedAt: "2026-05-17", status: "Parsed", pages: 67 },
  { id: "6", name: "Sunset Commons - OM.pdf", type: "OM", uploadedAt: "2026-05-16", status: "Failed", pages: 0 },
  { id: "7", name: "Industrial Park 12 - Rent Roll.xlsx", type: "Rent Roll", uploadedAt: "2026-05-16", status: "Parsed", pages: 5 },
  { id: "8", name: "Downtown Office Tower - Lease Abstract.pdf", type: "Lease Abstract", uploadedAt: "2026-05-15", status: "Parsed", pages: 24 },
  { id: "9", name: "Greenfield Residences - P&L.pdf", type: "P&L", uploadedAt: "2026-05-14", status: "Parsed", pages: 8 },
  { id: "10", name: "Metro Center - Appraisal Report.pdf", type: "Appraisal", uploadedAt: "2026-05-13", status: "Parsed", pages: 54 },
]

const typeBadgeVariant: Record<MockDocument["type"], "default" | "secondary" | "warning" | "success" | "outline"> = {
  OM: "default",
  "Rent Roll": "success",
  "Lease Abstract": "warning",
  "P&L": "secondary",
  Appraisal: "outline",
}

const statusConfig: Record<
  MockDocument["status"],
  { icon: typeof CheckCircle; color: string }
> = {
  Parsed: { icon: CheckCircle, color: "text-green-500" },
  Processing: { icon: Loader2, color: "text-yellow-500" },
  Failed: { icon: XCircle, color: "text-red-500" },
}

const keyFindings = [
  "Below-market rents on 12 units (~$150/unit upside)",
  "Deferred maintenance estimated at $340K",
  "3 units in eviction process",
  "Property tax appeal pending - potential $28K/yr savings",
]

export default function DocumentsPage() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>("1")
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Parser</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload and analyze offering memorandums, rent rolls, and financial documents with AI
        </p>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <p className="mt-4 text-base font-medium text-gray-900">
              Upload OMs, Rent Rolls, Lease Abstracts, P&Ls
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop files here, or{" "}
              <button className="text-blue-600 hover:underline font-medium">
                click to browse
              </button>
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> PDF
              </span>
              <span className="flex items-center gap-1">
                <File className="h-3 w-3" /> DOCX
              </span>
              <span className="flex items-center gap-1">
                <File className="h-3 w-3" /> XLSX
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Images
              </span>
            </div>
            <Button className="mt-4" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Upload Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents + Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Documents Table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Pages</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDocuments.map((doc) => {
                  const StatusIcon = statusConfig[doc.status].icon
                  const isSelected = selectedDoc === doc.id
                  return (
                    <TableRow
                      key={doc.id}
                      className={`cursor-pointer ${
                        isSelected ? "bg-blue-50 hover:bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedDoc(doc.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="font-medium text-sm truncate max-w-[200px]">
                            {doc.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeBadgeVariant[doc.type]} className="text-[10px]">
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {doc.uploadedAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <StatusIcon
                            className={`h-3.5 w-3.5 ${statusConfig[doc.status].color} ${
                              doc.status === "Processing" ? "animate-spin" : ""
                            }`}
                          />
                          <span className="text-xs text-gray-600">{doc.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-500">
                        {doc.pages || "-"}
                      </TableCell>
                      <TableCell>
                        {doc.status === "Parsed" && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Analysis Preview */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-base">AI Analysis</CardTitle>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              123 Main St - Offering Memorandum.pdf
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Property Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Building2 className="h-3 w-3" />
                    Property
                  </div>
                  <p className="mt-1 text-sm font-medium">123 Main St, Atlanta GA</p>
                  <p className="text-xs text-gray-500">Multi-Family (48 units)</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <DollarSign className="h-3 w-3" />
                    Asking Price
                  </div>
                  <p className="mt-1 text-sm font-medium">$6,200,000</p>
                  <p className="text-xs text-gray-500">$129,167/unit</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    Cap Rate
                  </div>
                  <p className="mt-1 text-sm font-medium">6.8%</p>
                  <p className="text-xs text-gray-500">NOI: $421,600</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Building2 className="h-3 w-3" />
                    Occupancy
                  </div>
                  <p className="mt-1 text-sm font-medium">94%</p>
                  <p className="text-xs text-gray-500">3 vacant units</p>
                </div>
              </div>

              <Separator />

              {/* Key Findings */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Findings</h4>
                <div className="space-y-2">
                  {keyFindings.map((finding, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-gray-700">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export to CRM
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Add to Deal Pipeline
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
