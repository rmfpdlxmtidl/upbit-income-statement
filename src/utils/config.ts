export const UPBIT_API_URL = 'https://api.upbit.com'
export const UPBIT_ACCESS_KEY = process.env.UPBIT_ACCESS_KEY ?? ''
export const UPBIT_SECRET_KEY = process.env.UPBIT_SECRET_KEY ?? ''

if (!UPBIT_ACCESS_KEY) throw new Error('Requires UPBIT_ACCESS_KEY')
if (!UPBIT_SECRET_KEY) throw new Error('Requires UPBIT_SECRET_KEY')
