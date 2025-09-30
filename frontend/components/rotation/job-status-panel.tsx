/**
 * Display job metadata and current status
 */

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StatusPill } from "@/components/ui/status-pill"
import { formatDate, formatRelative } from "@/lib/time"
import { formatChain } from "@/lib/format"
import type { Job } from "@/types/job"
import { ArrowRight, Clock, Calendar } from "lucide-react"

interface JobStatusPanelProps {
  job: Job
}

export function JobStatusPanel({ job }: JobStatusPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--color-muted-foreground)]">Status</p>
            <div className="mt-1">
              <StatusPill status={job.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--color-muted-foreground)]">Job ID</p>
            <p className="mt-1 font-mono text-xs text-[var(--color-foreground)]">{job.id}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 text-[var(--color-muted-foreground)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-foreground)]">Created</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{formatDate(job.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 text-[var(--color-muted-foreground)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-foreground)]">Release At</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {formatDate(job.releaseAt)} ({formatRelative(job.releaseAt)})
              </p>
            </div>
          </div>
        </div>

        {/* Route Summary */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Route
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1 text-center">
              <p className="font-medium text-[var(--color-foreground)]">{formatChain(job.sourceChain)}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{job.sourceAsset}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <div className="flex-1 text-center">
              <p className="font-medium text-[var(--color-zcash-gold)]">Zcash</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Shielded</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <div className="flex-1 text-center">
              <p className="font-medium text-[var(--color-foreground)]">{formatChain(job.destinationChain)}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{job.destinationAsset}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
