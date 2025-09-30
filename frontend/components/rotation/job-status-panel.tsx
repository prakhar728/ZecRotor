/**
 * Display job metadata and current status
 */

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { StatusPill } from "@/components/ui/status-pill"
import { formatDate, formatRelative } from "@/lib/time"
import { formatChain, formatMoney } from "@/lib/format"
import type { Job } from "@/types/job"
import { ArrowRight, Calendar, Clock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface JobStatusPanelProps {
  job: Job
}

export function JobStatusPanel({ job }: JobStatusPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        {/* Status & Job ID */}
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

        {/* Amount */}
        {job.amount && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4 text-center">
            <p className="text-sm text-[var(--color-muted-foreground)]">Amount</p>
            <p className="mt-1 text-xl font-semibold text-[var(--color-foreground)]">
              {formatMoney(job.amount, job.sourceAsset)}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
          <TimelineRow
            icon={<Calendar className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
            label="Created"
            value={formatDate(job.createdAt)}
          />
          <TimelineRow
            icon={<Clock className="h-4 w-4 text-[var(--color-muted-foreground)]" />}
            label="Release At"
            value={`${formatDate(job.releaseAt)} (${formatRelative(job.releaseAt)})`}
          />
          {job.status === "completed" && (
            <TimelineRow
              icon={<Clock className="h-4 w-4 text-[var(--color-accent-mint)]" />}
              label="Completed"
              value={formatDate(job.releaseAt)}
            />
          )}
          {job.status === "failed" && (
            <TimelineRow
              icon={<AlertTriangle className="h-4 w-4 text-red-400" />}
              label="Failed"
              value="An error occurred during rotation"
            />
          )}
        </div>

        {/* Route Summary */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Route
          </p>
          <div className="flex items-center justify-center gap-3">
            <ChainBadge chain={job.sourceChain} asset={job.sourceAsset} />
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <div className="flex flex-col items-center">
              <Badge variant="outline" className="border-[var(--color-zcash-gold)] text-[var(--color-zcash-gold)]">
                Zcash
              </Badge>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">Shielded</p>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <ChainBadge chain={job.destinationChain} asset={job.destinationAsset} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* Timeline Row */
function TimelineRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
        <p className="text-xs text-[var(--color-muted-foreground)]">{value}</p>
      </div>
    </div>
  )
}

/* Chain Badge */
function ChainBadge({ chain, asset }: { chain: string; asset: string }) {
  return (
    <div className="flex flex-col items-center">
      <Badge variant="secondary" className="text-[var(--color-foreground)]">
        {formatChain(chain)}
      </Badge>
      <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{asset}</p>
    </div>
  )
}
