import { format, isToday, isYesterday } from "date-fns"

export const formatMessageTime = (timestamp?: string) => {
  if (!timestamp) return ""

  // ✅ Ensure UTC → Local conversion
  const date = new Date(
    timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`
  )

  const now = new Date()

  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = diffInMs / (1000 * 60 * 60)

  if (diffInMinutes < 1) {
    return "now"
  }

  if (diffInHours < 1) {
    return `${diffInMinutes}m`
  }

  if (diffInHours < 24 && isToday(date)) {
    return `${Math.floor(diffInHours)}h`
  }

  if (isYesterday(date)) {
    return "Yesterday"
  }

  if (isToday(date)) {
    return format(date, "HH:mm")
  }

  return format(date, "dd/MM")
}


export const convertToPakistanTime = (utcDateString: string): string => {
  const date = new Date(utcDateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long', // e.g., "October"
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Karachi',
    hour12: false // 24-hour format
  }

  return new Intl.DateTimeFormat('en-PK', options).format(date)
}

// export const convertToPakistanTimeWithoutSecondsAndAMPMFormat = (utcDateString: string): string => {
//   const date = new Date(utcDateString)

//   const options: Intl.DateTimeFormatOptions = {
//     year: 'numeric',
//     // month: 'long', // e.g., "October"
//     month: 'short', // e.g., "October"
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     timeZone: 'Asia/Karachi',
//     hour12: true // Enable 12-hour format with AM/PM
//   }

//   return new Intl.DateTimeFormat('en-PK', options).format(date)
// }

export const convertToPakistanTimeWithoutSecondsAndAMPMFormat = (utcDateString: string): string => {
  const date = new Date(utcDateString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Karachi',
    hour12: true
  }

  const formatter = new Intl.DateTimeFormat('en-PK', options)
  const parts = formatter.formatToParts(date)

  // Reconstruct the formatted date with uppercase AM/PM
  const formattedDate = parts
    .map(part => {
      if (part.type === 'dayPeriod') {
        return part.value.toUpperCase()
      }
      return part.value
    })
    .join('')

  return formattedDate
}

export const convertToPakistanDateWithoutTime = (utcDateString: string): string => {
  const date = new Date(utcDateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long', // e.g., "October"
    day: 'numeric',
    timeZone: 'Asia/Karachi'
  }

  return new Intl.DateTimeFormat('en-PK', options).format(date)
}

export const convertToPakistanDatePlus10Days = (utcDateString: string): string => {
  // Parse the UTC date string into a Date object
  const date = new Date(utcDateString)

  // Check for invalid date
  if (isNaN(date.getTime())) {
    throw new Error('Invalid UTC date string provided.')
  }

  // Add 10 days to the date
  date.setDate(date.getDate() + 10)

  // Define formatting options for date only
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long', // e.g., "November"
    day: 'numeric',
    timeZone: 'Asia/Karachi'
  }

  // Format the adjusted date to Pakistan Standard Time
  return new Intl.DateTimeFormat('en-PK', options).format(date)
}

export const convertToPakistanTimePlusOneHour = (utcDateString: string): string => {
  // Create a Date object from the UTC date string
  const date = new Date(utcDateString)

  // Add one hour to the UTC time
  date.setUTCHours(date.getUTCHours() + 1)

  // Define formatting options to display only the time
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Karachi',
    hour12: false // 24-hour format
  }

  // Format the time according to the specified options and Pakistan locale
  return new Intl.DateTimeFormat('en-PK', options).format(date)
}

export const convertToPakistanTimePlusOneHourWithDate = (utcDateString: string): string => {
  // Create a Date object from the UTC date string
  const date = new Date(utcDateString)

  // Add one hour to the UTC time
  date.setUTCHours(date.getUTCHours() + 1)

  // Define formatting options to display date and time
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', // e.g., 2024
    month: 'long', // e.g., 04
    day: '2-digit', // e.g., 27
    hour: '2-digit', // e.g., 14
    minute: '2-digit', // e.g., 30
    second: '2-digit', // e.g., 45
    timeZone: 'Asia/Karachi',
    hour12: false // 24-hour format
  }

  // Format the date and time according to the specified options and Pakistan locale
  return new Intl.DateTimeFormat('en-PK', options).format(date)
}


