/**
 * Display deposit address and job details after creation
 */

"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyField } from "@/components/ui/copy-field"
import { QRCode } from "@/components/ui/qr-code"
import { formatMoney } from "@/lib/format"
import type { Job } from "@/types/job"
import { CheckCircle2, ArrowRight } from "lucide-react"

interface DepositDetailsProps {
  job: Job
  onTrackStatus: (jobId: string) => void
}

export function DepositDetails({ job, onTrackStatus }: DepositDetailsProps) {
  const depositAddress = job.depositAddress || "Generating..."
  const minConfirmations = 3

  return (
    <Card className="border-[var(--color-zcash-gold)]/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[var(--color-accent-mint)]" />
          <CardTitle>Rotation Created</CardTitle>
        </div>
        <CardDescription>Send funds to the address below to start your rotation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="rounded-lg bg-[var(--color-snow)] p-4">
            <QRCode value={depositAddress} size={180} />
          </div>
        </div>

        {/* Deposit Address */}
        <CopyField label="Deposit Address" value={depositAddress} monospace />

        {/* Job Details */}
        <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">Amount</span>
            <span className="font-mono font-medium text-[var(--color-foreground)]">
              {formatMoney(job.amount || 0, job.sourceAsset)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">Min. Confirmations</span>
            <span className="font-medium text-[var(--color-foreground)]">{minConfirmations}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">Job ID</span>
            <span className="font-mono text-xs text-[var(--color-foreground)]">{job.id}</span>
          </div>
        </div>

        {/* Important Notice */}
        <div className="rounded-md border border-[var(--color-zcash-gold)]/30 bg-[var(--color-zcash-gold)]/10 p-3 text-sm text-[var(--color-snow)]">
          <p className="font-medium">Important:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            <li>Save your Job ID to track this rotation</li>
            <li>
              Only send {job.sourceAsset} on {job.sourceChain}
            </li>
            <li>Funds will be released at the scheduled time</li>
          </ul>
        </div>

        {/* Track Status CTA */}
        <Button onClick={() => onTrackStatus(job.id)} variant="outline" className="w-full">
          Track Status
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
