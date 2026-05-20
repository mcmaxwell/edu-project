import { cn } from './cn'

type Confidence = 'low' | 'medium' | 'high' | 'inconclusive'

export type ScoreGaugeProps = {
  value: number
  max?: number
  confidence?: Confidence
  label?: string
  className?: string
}

export function ScoreGauge({
  value,
  max = 100,
  confidence = 'medium',
  label,
  className,
}: ScoreGaugeProps) {
  const pct = Math.max(0, Math.min(1, value / max))
  const radius = 56
  const circumference = Math.PI * radius
  const offset = circumference * (1 - pct)

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <svg width={140} height={80} viewBox="0 0 140 80" aria-label={`Score ${value} of ${max}`}>
        <path
          d={`M 14 70 A ${radius} ${radius} 0 0 1 126 70`}
          fill="none"
          stroke="#EADFC6"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={`M 14 70 A ${radius} ${radius} 0 0 1 126 70`}
          fill="none"
          stroke="#1B2A4E"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="-mt-6 text-center">
        <div className="font-mono text-h3 font-semibold text-ink tabular-nums">{value}</div>
        {label ? (
          <div className="text-eyebrow font-sans font-semibold uppercase text-slate mt-1">
            {label}
          </div>
        ) : null}
        <div className="text-body-sm text-slate mt-1 capitalize">{confidence}</div>
      </div>
    </div>
  )
}
