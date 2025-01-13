import * as React from "react"
import { cn } from "@/lib/utils"

interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, value, onChange, maxLength = 6, ...props }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
    
    const focusNextInput = (index: number) => {
      if (index < maxLength - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const focusPrevInput = (index: number) => {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }

    const handleInputChange = (index: number, inputValue: string) => {
      const newValue = value.split('')
      newValue[index] = inputValue
      const updatedValue = newValue.join('')
      
      onChange(updatedValue)
      
      if (inputValue !== '') {
        focusNextInput(index)
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !value[index]) {
        focusPrevInput(index)
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData('text/plain')
      const pastedValue = pastedData.slice(0, maxLength)
      
      if (/^\d+$/.test(pastedValue)) {
        onChange(pastedValue)
        inputRefs.current[Math.min(pastedValue.length, maxLength - 1)]?.focus()
      }
    }

    return (
      <div 
        ref={ref}
        className={cn(
          "flex gap-2 items-center justify-center",
          className
        )}
      >
        {Array.from({ length: maxLength }).map((_, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[index] || ''}
            onChange={e => handleInputChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "w-12 h-14 text-center text-2xl font-bold rounded-md",
              "bg-card border-2 border-muted",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "text-foreground placeholder:text-muted-foreground",
              "transition-all duration-200"
            )}
            {...props}
          />
        ))}
      </div>
    )
  }
)

InputOTP.displayName = "InputOTP"

export { InputOTP }