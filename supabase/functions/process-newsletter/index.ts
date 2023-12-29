// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.1/mod.ts'

import type { RawLink } from './types.ts'
import {
  getNewsletter,
  getUserIdFromEmail,
  createLink,
  createCuratedLink,
  getIssue,
  getDefaultDate,
} from './helpers.ts'

const apiKey = Deno.env.get('CHAT_GPT_KEY')
const openai = new OpenAI({ apiKey })

const prompt =
  'I am going to provide you with the body of an email.' +
  ' This email is a newsletter which contains various web links and descriptions of the websites. ' +
  'Please determine the name of the newsletter, the date the newsletter was sent (formatted like YYYY-MM-DD) ' +
  'and the sender of the newsletter if that information is available. Please then also provide a list of all the links ' +
  'in the newsletter as well as the descriptions of each link. Do not summarise the description, use the description from the email. ' +
  "Please give me all the data in JSON format. Like this: { newsletter: { name: 'Newsletter name', " +
  "sender: 'some sender', issueNumber: 121, webLink: 'www.somelink.com', date: '2022-01-26' }, links: [{ title: 'This link', " +
  "url: 'www.someurl.com', description: 'lorem ipsum'  }] }. The email is as follows:"

serve(async (req) => {
  const { body, fromEmail } = await req.json()

  try {
    const stream = await openai.beta.chat.completions.stream({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `${prompt}: ${body}` }],
      stream: true,
    })

    const chatCompletion = await stream.finalChatCompletion() // {id: "…", choices: […], …}
    const data = chatCompletion.choices[0]?.message?.content
    console.log('🚀 ~ file: index.ts:35 ~ serve ~ data:', data)

    if (!data) {
      throw new Error('No data')
    }

    const parsedData = JSON.parse(data)
    console.log('🚀 ~ file: index.ts:42 ~ serve ~ newsletterData:', parsedData)

    const { name, sender, date = getDefaultDate(), webLink, issueNumber } = parsedData.newsletter || {}
    const newsletter = await getNewsletter({ name, sender })
    console.log('🚀 ~ file: index.ts:46 ~ serve ~ newsletter:', newsletter)
    const issue = await getIssue({ newsletterId: newsletter.id, issueNumber, date, webLink })
    console.log('🚀 ~ file: index.ts:48 ~ serve ~ issue:', issue)
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

  return new Response('ok', { headers: { 'Content-Type': 'application/json' } })
})
