export interface CSVData {
  phoneNumber: string
  customerName: string | null
}

export interface CSVError {
  row: number
  error: string
  data?: any
}


// Update the NewTemplate interface
export interface NewTemplate {
  title: string
  url?: string
  lang: string
  header?: string
  body: string
  footer?: string
  btn?: string
  btnUrl?: string
  btn2?: string
  btn2Url?: string
  btn3?: string
  headerImage?: File | null
  headerImagePreview?: string
}

// Also update the Template interface
export interface Template {
  id: number
  title: string
  name: string
  url?: string
  lang: string
  header?: string
  body: string
  footer?: string
  btn?: string
  btnUrl?: string
  btn2?: string
  btn2Url?: string
  btn3?: string
  is_favorite?: boolean 
}

// Add these helper functions near other helper functions
export const MAX_BUTTON_TEXT_LENGTH = 25
export const MAX_BUTTON_COUNT = 3

export const getButtonFields = (template: NewTemplate | Template) => {
  const buttons = []
  
  if (template.btn && template.btnUrl) {
    buttons.push({ text: template.btn, url: template.btnUrl, fieldPrefix: '' })
  }
  if (template.btn2 && template.btn2Url) {
    buttons.push({ text: template.btn2, url: template.btn2Url, fieldPrefix: '2' })
  }
  
  
  return buttons
}

const validateButtonText = (text: string): boolean => {
  return text.length <= MAX_BUTTON_TEXT_LENGTH
}


export const validCountryCodes = [
  "1",
  "7",
  "20",
  "27",
  "30",
  "31",
  "32",
  "33",
  "34",
  "36",
  "39",
  "40",
  "41",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "81",
  "82",
  "84",
  "86",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "98",
  "211",
  "212",
  "213",
  "216",
  "218",
  "220",
  "221",
  "222",
  "223",
  "224",
  "225",
  "226",
  "227",
  "228",
  "229",
  "230",
  "231",
  "232",
  "233",
  "234",
  "235",
  "236",
  "237",
  "238",
  "239",
  "240",
  "241",
  "242",
  "243",
  "244",
  "245",
  "246",
  "248",
  "249",
  "250",
  "251",
  "252",
  "253",
  "254",
  "255",
  "256",
  "257",
  "258",
  "260",
  "261",
  "262",
  "263",
  "264",
  "265",
  "266",
  "267",
  "268",
  "269",
  "290",
  "291",
  "297",
  "298",
  "299",
  "350",
  "351",
  "352",
  "353",
  "354",
  "355",
  "356",
  "357",
  "358",
  "359",
  "370",
  "371",
  "372",
  "373",
  "374",
  "375",
  "376",
  "377",
  "378",
  "379",
  "380",
  "381",
  "382",
  "383",
  "385",
  "386",
  "387",
  "389",
  "420",
  "421",
  "423",
  "500",
  "501",
  "502",
  "503",
  "504",
  "505",
  "506",
  "507",
  "508",
  "509",
  "590",
  "591",
  "592",
  "593",
  "594",
  "595",
  "596",
  "597",
  "598",
  "599",
  "670",
  "672",
  "673",
  "674",
  "675",
  "676",
  "677",
  "678",
  "679",
  "680",
  "681",
  "682",
  "683",
  "685",
  "686",
  "687",
  "688",
  "689",
  "690",
  "691",
  "692",
  "850",
  "852",
  "853",
  "855",
  "856",
  "880",
  "886",
  "960",
  "961",
  "962",
  "963",
  "964",
  "965",
  "966",
  "967",
  "968",
  "970",
  "971",
  "972",
  "973",
  "974",
  "975",
  "976",
  "977",
  "992",
  "993",
  "994",
  "995",
  "996",
  "998",
]

export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
  const cleanPhone = phone.replace(/[\s\-()]/g, "")
  if (!/^\d+$/.test(cleanPhone)) {
    return { isValid: false, error: "Phone number must contain only digits" }
  }
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { isValid: false, error: "Phone number must be 10-15 digits long" }
  }
  let hasValidCountryCode = false
  const sortedCountryCodes = [...validCountryCodes].sort((a, b) => b.length - a.length)
  for (const code of sortedCountryCodes) {
    if (cleanPhone.startsWith(code)) {
      const remainingDigits = cleanPhone.length - code.length
      if (remainingDigits >= 7 && remainingDigits <= 12) {
        hasValidCountryCode = true
        break
      }
    }
  }
  if (!hasValidCountryCode) {
    return {
      isValid: false,
      error: `Phone number must start with a valid country code. Examples: 92 (Pakistan), 1 (US), 44 (UK). Found: ${cleanPhone.substring(0, 3)}...`,
    }
  }
  return { isValid: true }
}
