import { createClient } from 'https://esm.sh/@supabase/supabase-js'

import type { Link } from './types.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const supabase = createClient(supabaseUrl, supabaseKey)

export const getUserIdFromEmail = async (email: string) => {
  const { data: userData, error } = await supabase
    .from('email_addresses')
    .select('*')
    .filter('email_address', 'eq', email)
    .single()

  if (error) {
    throw error
  }

  if (!userData) {
    throw new Error('No user found')
  }

  return userData.user_id
}

export const getNewsletter = async ({ name, sender }: { name: string; sender: string }) => {
  const { data: newsletterData, error } = await supabase
    .from('newsletters')
    .select('*')
    .filter('name', 'ilike', `%${name}%`)

  if (error) {
    throw error
  }

  if (!newsletterData || newsletterData.length === 0) {
    const { data: newsletterData, error } = await supabase
      .from('newsletters')
      .insert({ name, sender })
      .select()
      .single()

    if (error) {
      throw error
    }

    return newsletterData
  }

  return newsletterData
}

export const createLink = async (link: Link) => {
  const { error } = await supabase
    .from('links')
    .upsert({ ...link, link_key: `${link.url}_${link.newsletter_id}` }, { onConflict: 'link_key' })
    .select()

  if (error) {
    throw error
  }
}

type CuratedLink = Link & {
  user_id: string
}

export const createCuratedLink = async (link: CuratedLink) => {
  console.log('create curated link', link.title)
  const { error } = await supabase.from('curated_links').upsert(link).select()

  if (error) {
    throw error
  }
}
