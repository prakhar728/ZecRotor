/**
 * Form for creating a new rotation request
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useJobsApi } from "@/hooks/use-jobs-api"
import { validateRotationForm } from "@/lib/validators"
import { toIsoLocal } from "@/lib/time"
import type { Job } from "@/types/job"
import { Loader2 } from "lucide-react"

interface CreateRotationFormProps {
  onSuccess: (job: Job) => void
}

const chains = ["ETH", "NEAR", "ZCASH"]
const assets: Record<string, string[]> = {
  ETH: ["USDC", "ETH"],
  NEAR: ["NEAR", "USDC"],
  ZCASH: ["ZEC"],
}

export function CreateRotationForm({ onSuccess }: CreateRotationFormProps) {
  const { createJob } = useJobsApi()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const [formData, setFormData] = React.useState({
    sourceChain: "ETH",
    sourceAsset: "USDC",
    amount: "",
    destinationChain: "NEAR",
    destinationAsset: "NEAR",
    destinationAddress: "",
    releaseAt: toIsoLocal(new Date(Date.now() + 3600000)), // 1 hour from now
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const amount = Number.parseFloat(formData.amount)
    const errors = validateRotationForm({
      amount,
      releaseAt: formData.releaseAt,
      destinationAddress: formData.destinationAddress,
      destinationChain: formData.destinationChain,
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createJob({
        sourceChain: formData.sourceChain,
        sourceAsset: formData.sourceAsset,
        amount,
        destinationChain: formData.destinationChain,
        destinationAsset: formData.destinationAsset,
        destinationAddress: formData.destinationAddress,
        releaseAt: new Date(formData.releaseAt).toISOString(),
        notes: formData.notes || undefined,
      })

      onSuccess(response.job)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rotation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Rotation</CardTitle>
        <CardDescription>Schedule a private asset rotation through Zcash's shielded pool</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source */}
          <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Source</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sourceChain">Chain</Label>
                <Select value={formData.sourceChain} onValueChange={(val) => updateField("sourceChain", val)}>
                  <SelectTrigger id="sourceChain">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceAsset">Asset</Label>
                <Select value={formData.sourceAsset} onValueChange={(val) => updateField("sourceAsset", val)}>
                  <SelectTrigger id="sourceAsset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assets[formData.sourceChain]?.map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                aria-invalid={!!fieldErrors.amount}
                aria-describedby={fieldErrors.amount ? "amount-error" : undefined}
              />
              {fieldErrors.amount && (
                <p id="amount-error" className="text-sm text-red-400">
                  {fieldErrors.amount}
                </p>
              )}
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Destination</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="destinationChain">Chain</Label>
                <Select value={formData.destinationChain} onValueChange={(val) => updateField("destinationChain", val)}>
                  <SelectTrigger id="destinationChain">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationAsset">Asset</Label>
                <Select value={formData.destinationAsset} onValueChange={(val) => updateField("destinationAsset", val)}>
                  <SelectTrigger id="destinationAsset">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assets[formData.destinationChain]?.map((asset) => (
                      <SelectItem key={asset} value={asset}>
                        {asset}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationAddress">Address</Label>
              <Input
                id="destinationAddress"
                placeholder="0x... or account.near"
                value={formData.destinationAddress}
                onChange={(e) => updateField("destinationAddress", e.target.value)}
                aria-invalid={!!fieldErrors.destinationAddress}
                aria-describedby={fieldErrors.destinationAddress ? "address-error" : undefined}
              />
              {fieldErrors.destinationAddress && (
                <p id="address-error" className="text-sm text-red-400">
                  {fieldErrors.destinationAddress}
                </p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h4 className="text-sm font-semibold text-[var(--color-foreground)]">Schedule</h4>
            <div className="space-y-2">
              <Label htmlFor="releaseAt">Release At</Label>
              <Input
                id="releaseAt"
                type="datetime-local"
                value={formData.releaseAt}
                onChange={(e) => updateField("releaseAt", e.target.value)}
                aria-invalid={!!fieldErrors.releaseAt}
                aria-describedby={fieldErrors.releaseAt ? "release-error" : "release-help"}
              />
              {fieldErrors.releaseAt ? (
                <p id="release-error" className="text-sm text-red-400">
                  {fieldErrors.releaseAt}
                </p>
              ) : (
                <p id="release-help" className="text-xs text-[var(--color-muted-foreground)]">
                  Time shown in your local timezone
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this rotation..."
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Rotation"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
