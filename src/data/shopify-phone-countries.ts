/**
 * Country phone data for generating E.164 dummy numbers that pass Shopify/libphonenumber validation.
 * Format: E.164 = +[countryCode][nationalNumber] (no spaces, max 15 digits total).
 */

export interface CountryPhoneConfig {
  code: string
  name: string
  dialCode: string
  /** Length of national number (excluding country code). */
  nationalLength: number
  /** Optional: national number must start with one of these prefixes (e.g. mobile). */
  nationalPrefixes?: string[]
}

export const SHOPIFY_PHONE_COUNTRIES: CountryPhoneConfig[] = [
  { code: 'US', name: 'United States', dialCode: '1', nationalLength: 10 },
  { code: 'CA', name: 'Canada', dialCode: '1', nationalLength: 10 },
  { code: 'GB', name: 'United Kingdom', dialCode: '44', nationalLength: 10, nationalPrefixes: ['7'] },
  { code: 'AU', name: 'Australia', dialCode: '61', nationalLength: 9 },
  { code: 'DE', name: 'Germany', dialCode: '49', nationalLength: 10, nationalPrefixes: ['15', '16', '17'] },
  { code: 'FR', name: 'France', dialCode: '33', nationalLength: 9, nationalPrefixes: ['6', '7'] },
  { code: 'IT', name: 'Italy', dialCode: '39', nationalLength: 9, nationalPrefixes: ['3'] },
  { code: 'ES', name: 'Spain', dialCode: '34', nationalLength: 9, nationalPrefixes: ['6', '7'] },
  { code: 'NL', name: 'Netherlands', dialCode: '31', nationalLength: 9, nationalPrefixes: ['6'] },
  { code: 'BE', name: 'Belgium', dialCode: '32', nationalLength: 9, nationalPrefixes: ['4'] },
  { code: 'JP', name: 'Japan', dialCode: '81', nationalLength: 10, nationalPrefixes: ['90', '80', '70'] },
  { code: 'KR', name: 'South Korea', dialCode: '82', nationalLength: 9, nationalPrefixes: ['10'] },
  { code: 'CN', name: 'China', dialCode: '86', nationalLength: 11, nationalPrefixes: ['13', '14', '15', '16', '17', '18', '19'] },
  { code: 'IN', name: 'India', dialCode: '91', nationalLength: 10, nationalPrefixes: ['6', '7', '8', '9'] },
  { code: 'BR', name: 'Brazil', dialCode: '55', nationalLength: 10, nationalPrefixes: ['9'] },
  { code: 'MX', name: 'Mexico', dialCode: '52', nationalLength: 10, nationalPrefixes: ['1'] },
  { code: 'AR', name: 'Argentina', dialCode: '54', nationalLength: 10, nationalPrefixes: ['9', '11'] },
  { code: 'ID', name: 'Indonesia', dialCode: '62', nationalLength: 9, nationalPrefixes: ['8'] },
  { code: 'MY', name: 'Malaysia', dialCode: '60', nationalLength: 9, nationalPrefixes: ['1'] },
  { code: 'SG', name: 'Singapore', dialCode: '65', nationalLength: 8 },
  { code: 'PH', name: 'Philippines', dialCode: '63', nationalLength: 10, nationalPrefixes: ['9'] },
  { code: 'TH', name: 'Thailand', dialCode: '66', nationalLength: 9, nationalPrefixes: ['6', '8', '9'] },
  { code: 'VN', name: 'Vietnam', dialCode: '84', nationalLength: 9, nationalPrefixes: ['3', '5', '7', '8', '9'] },
  { code: 'PL', name: 'Poland', dialCode: '48', nationalLength: 9, nationalPrefixes: ['5', '6', '7', '8'] },
  { code: 'SE', name: 'Sweden', dialCode: '46', nationalLength: 9, nationalPrefixes: ['7'] },
  { code: 'NO', name: 'Norway', dialCode: '47', nationalLength: 8 },
  { code: 'DK', name: 'Denmark', dialCode: '45', nationalLength: 8 },
  { code: 'FI', name: 'Finland', dialCode: '358', nationalLength: 9, nationalPrefixes: ['4', '5'] },
  { code: 'IE', name: 'Ireland', dialCode: '353', nationalLength: 9, nationalPrefixes: ['8'] },
  { code: 'PT', name: 'Portugal', dialCode: '351', nationalLength: 9, nationalPrefixes: ['9'] },
  { code: 'CH', name: 'Switzerland', dialCode: '41', nationalLength: 9, nationalPrefixes: ['7', '8'] },
  { code: 'AT', name: 'Austria', dialCode: '43', nationalLength: 10, nationalPrefixes: ['6'] },
  { code: 'NZ', name: 'New Zealand', dialCode: '64', nationalLength: 9, nationalPrefixes: ['2', '21', '22', '27', '28', '29'] },
  { code: 'ZA', name: 'South Africa', dialCode: '27', nationalLength: 9, nationalPrefixes: ['6', '7', '8'] },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '971', nationalLength: 9, nationalPrefixes: ['5'] },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '966', nationalLength: 9, nationalPrefixes: ['5'] },
  { code: 'TR', name: 'Turkey', dialCode: '90', nationalLength: 10, nationalPrefixes: ['5'] },
  { code: 'RU', name: 'Russia', dialCode: '7', nationalLength: 10, nationalPrefixes: ['9'] },
  { code: 'HK', name: 'Hong Kong', dialCode: '852', nationalLength: 8 },
  { code: 'TW', name: 'Taiwan', dialCode: '886', nationalLength: 9, nationalPrefixes: ['9'] },
  { code: 'IL', name: 'Israel', dialCode: '972', nationalLength: 9, nationalPrefixes: ['5'] },
  { code: 'EG', name: 'Egypt', dialCode: '20', nationalLength: 10, nationalPrefixes: ['1'] },
  { code: 'NG', name: 'Nigeria', dialCode: '234', nationalLength: 10, nationalPrefixes: ['7', '8', '9'] },
  { code: 'KE', name: 'Kenya', dialCode: '254', nationalLength: 9, nationalPrefixes: ['7', '1'] },
  { code: 'CO', name: 'Colombia', dialCode: '57', nationalLength: 10, nationalPrefixes: ['3'] },
  { code: 'CL', name: 'Chile', dialCode: '56', nationalLength: 9, nationalPrefixes: ['9'] },
  { code: 'PE', name: 'Peru', dialCode: '51', nationalLength: 9, nationalPrefixes: ['9'] },
]
