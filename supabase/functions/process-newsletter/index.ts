// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

import { convertNewsletterToLinks } from './helpers.ts'

serve(async (req) => {
  const { body, fromEmail } = await req.json()
  convertNewsletterToLinks(body, fromEmail)
  return new Response('ok', { headers: { 'Content-Type': 'application/json' } })
})
