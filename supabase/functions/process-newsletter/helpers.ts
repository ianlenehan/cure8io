import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import OpenAI from 'https://deno.land/x/openai@v4.24.1/mod.ts'

import type { Link, RawLink } from './types.ts'
import { prompt } from './prompt.ts'

const apiKey = Deno.env.get('CHAT_GPT_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const openai = new OpenAI({ apiKey })

const supabase = createClient(supabaseUrl, supabaseKey)

export const getDefaultDate = () => {
  const today = new Date()

  // Get the year, month, and day
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0')

  // Format the date to YYYY-MM-DD
  return `${year}-${month}-${day}`
}

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
  const newsletterKey = `${name}_${sender}`
  const { data: newsletterData, error } = await supabase
    .from('newsletters')
    .upsert({ name, sender, newsletter_key: newsletterKey }, { onConflict: 'newsletter_key' })
    .select()
    .single()

  if (error) {
    throw error
  }

  return newsletterData
}

type GetIssueArgs = {
  newsletterId: string
  issueNumber?: number
  date: string
  webLink?: string
}

export const getIssue = async ({ newsletterId, issueNumber, webLink, date }: GetIssueArgs) => {
  const issueKey = `${newsletterId}_${date}`
  const { data: issueData, error } = await supabase
    .from('issues')
    .upsert(
      { newsletter_id: newsletterId, issue_number: issueNumber, web_link: webLink, issue_key: issueKey, date },
      { onConflict: 'issue_key' }
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return issueData
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
  const { error } = await supabase.from('curated_links').upsert(link).select()

  if (error) {
    throw error
  }
}

export const processNewsletter = async (chatGptJson: string, fromEmail: string) => {
  console.log('processing')
  try {
    const parsedData = JSON.parse(chatGptJson)
    console.log('🚀 ~ file: index.ts:42 ~ serve ~ newsletterData:', parsedData)

    const { name, sender, date = getDefaultDate(), webLink, issueNumber } = parsedData.newsletter || {}
    const newsletter = await getNewsletter({ name, sender })
    console.log('🚀 ~ file: helpers.ts:115 ~ processNewsletter ~ newsletter:', newsletter)
    const issue = await getIssue({ newsletterId: newsletter.id, issueNumber, date, webLink })
    console.log('🚀 ~ file: helpers.ts:117 ~ processNewsletter ~ issue:', issue)
    const userId = await getUserIdFromEmail(fromEmail)

    const linkPromises = parsedData.links.map((link: RawLink) => {
      return createLink({ ...link, newsletter_id: newsletter.id, issue_id: issue.id })
    })

    const curationPromises = parsedData.links.map((link: RawLink) => {
      return createCuratedLink({ ...link, newsletter_id: newsletter.id, issue_id: issue.id, user_id: userId })
    })

    console.log('promising')
    await Promise.all([...linkPromises, ...curationPromises])
  } catch (e) {
    console.error('There was en error', e)
  }
}

export const convertNewsletterToLinks = async (body: string, fromEmail: string) => {
  try {
    const stream = await openai.beta.chat.completions.stream({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `${prompt}: ${body}` }],
      stream: true,
    })

    const chatCompletion = await stream.finalChatCompletion() // {id: "…", choices: […], …}
    const data = chatCompletion.choices[0]?.message?.content
    console.log('🚀 ~ file: helpers.ts:145 ~ convertNewsletterToLinks ~ data:', data)

    if (!data) {
      throw new Error('No data')
    }

    await processNewsletter(data, fromEmail)
  } catch (error) {
    console.log('🚀 ~ file: helpers.ts:153 ~ convertNewsletterToLinks ~ error:', error)
  }
}
