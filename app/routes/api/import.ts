import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

export const action = async ({ request }: ActionArgs) => {
  switch (request.method) {
    case 'POST': {
      const payload = await request.json()
      console.log('🚀 ~ file: import.ts:7 ~ action ~ payload:', payload)
      return json({ success: true, payload }, 200)
    }
  }
}
