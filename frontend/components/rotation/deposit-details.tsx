/**
 * Display deposit address and job details after creation
 */

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyField } from "@/components/ui/copy-field"
import { QRCode } from "@/components/ui/qr-code"
import { formatMoney } from "@/lib/format"
import type { Job } from "@/types/job"
import { CheckCircle2, ArrowRight, Clock, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { EXPLORERS } from "@/config/chains"

interface DepositDetailsProps {
  job: Job
  onTrackStatus: (jobId: string) => void
}

export function DepositDetails({ job, onTrackStatus }: DepositDetailsProps) {
  const depositAddress = job.depositAddress || "Generating..."
  const minConfirmations = 3
  const [showNotice, setShowNotice] = React.useState(true)

  // Countdown timer
  const [remaining, setRemaining] = React.useState("")
  React.useEffect(() => {
    if (!job.releaseAt) return
    const interval = setInterval(() => {
      const diff = new Date(job.releaseAt).getTime() - Date.now()
      if (diff <= 0) {
        setRemaining("Ready for release")
        clearInterval(interval)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setRemaining(`${hours}h ${mins}m`)
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [job.releaseAt])

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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-lg bg-[var(--color-snow)] p-4"
          >
            <QRCode value={depositAddress} size={180} />
          </motion.div>
        </div>

        {/* Deposit Address */}
        <CopyField label="Deposit Address" value={depositAddress} monospace />

        {/* Job Details */}
        <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
          <InfoRow label="Amount">
            {formatMoney(job.amount || 0, job.sourceAsset)}
          </InfoRow>
          <InfoRow label="Min. Confirmations">{minConfirmations}</InfoRow>
          <InfoRow label="Job ID">
            <CopyField value={job.id} monospace  label="job-id"/>
          </InfoRow>
          {job.releaseAt && (
            <InfoRow label="Releases In">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                <span>{remaining}</span>
              </div>
            </InfoRow>
          )}
          {job.txs?.deposit?.explorerUrl && (
            <InfoRow label="Explorer">
              <a
                href={job.txs.deposit.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--color-zcash-gold)] hover:underline"
              >
                View Transaction <ExternalLink className="h-3 w-3" />
              </a>
            </InfoRow>
          )}
        </div>

        {/* Important Notice */}
        <div className="rounded-md border border-[var(--color-zcash-gold)]/30 bg-[var(--color-zcash-gold)]/10 p-3 text-sm">
          <button
            type="button"
            className="flex w-full items-center justify-between text-[var(--color-snow)]"
            onClick={() => setShowNotice((s) => !s)}
          >
            <span className="font-medium">Important</span>
            {showNotice ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showNotice && (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-[var(--color-snow)]">
              <li>Save your Job ID to track this rotation</li>
              <li>
                Only send {job.sourceAsset} on {job.sourceChain}
              </li>
              <li>Funds will be released at the scheduled time</li>
            </ul>
          )}
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

// Small reusable info row component
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-muted-foreground)]">{label}</span>
      <span className="font-mono text-[var(--color-foreground)]">{children}</span>
    </div>
  )
}
