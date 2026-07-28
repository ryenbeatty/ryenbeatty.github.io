import type { ReactNode } from 'react'

type OutpostPanelProps = {
  title: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export function OutpostPanel({
  title,
  children,
  className = '',
  bodyClassName = '',
}: OutpostPanelProps) {
  return (
    <section className={`outpost__panel ${className}`.trim()}>
      <header className="outpost__panel-header">{title}</header>
      <div className={`outpost__panel-body ${bodyClassName}`.trim()}>{children}</div>
    </section>
  )
}
