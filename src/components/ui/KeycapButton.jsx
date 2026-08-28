import React from 'react'
import { cn } from '../../lib/utils'

export const KeycapButton = ({
  children,
  className,
  letterClassName,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "keycap disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className={cn("letter", letterClassName)}>
        {children}
      </span>
    </button>
  )
}

export default KeycapButton
