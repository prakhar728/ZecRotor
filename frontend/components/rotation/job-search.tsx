/**
 * Search form for looking up jobs by ID
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface JobSearchProps {
  onSearch: (jobId: string) => void
  initialJobId?: string
}

export function JobSearch({ onSearch, initialJobId = "" }: JobSearchProps) {
  const [jobId, setJobId] = React.useState(initialJobId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (jobId.trim()) {
      onSearch(jobId.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jobId">Job ID</Label>
        <div className="flex gap-2">
          <Input
            id="jobId"
            placeholder="Enter your Job ID..."
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="flex-1 font-mono text-sm"
          />
          <Button type="submit" disabled={!jobId.trim()}>
            <Search className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
