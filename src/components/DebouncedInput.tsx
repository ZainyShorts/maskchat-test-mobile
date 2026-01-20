// components/DebouncedInput.tsx

import React, { useState, useEffect } from 'react'

interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  delay?: number
  className?: string
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  placeholder = '',
  delay = 300,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState<string>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [internalValue, onChange, delay])

  return (
    <input
      type='text'
      value={internalValue}
      placeholder={placeholder}
      onChange={e => setInternalValue(e.target.value)}
      className={className}
      style={styles.input}
    />
  )
}

// Basic inline styles (you can customize or use CSS classes)
const styles: { [key: string]: React.CSSProperties } = {
  input: {
    padding: '10px',
    width: '100%',
    fontSize: '16px',
    boxSizing: 'border-box'
  }
}

export default DebouncedInput
