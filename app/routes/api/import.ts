import type { ActionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import axios from 'axios'
import OpenAI from 'openai'

const apiKey = process.env.CHAT_GPT_KEY
const openai = new OpenAI({ apiKey })

const prompt =
  'I am going to provide you with the body of an email.' +
  ' This email is a newsletter which contains various web links and descriptions of the websites. ' +
  'Please determine the name of the newsletter, and the sender of the newsletter if that information ' +
  'is available. Please then also provide a list of all the links in the newsletter as well as the ' +
  'descriptions of each link. Do not summarise the description, use the description from the email. ' +
  "Please give me all the data in JSON format. Like this: { newsletter: { name: 'Newsletter name', " +
  "sender: 'some sender', issueNumber: 121, webLink: 'www.somelink.com' }, links: [{ title: 'This link', " +
  "url: 'www.someurl.com', description: 'lorem ipsum'  }] }. The email is as follows:"

export const action = async ({ request }: ActionArgs) => {
  switch (request.method) {
    case 'POST': {
      const { data, sender } = await request.json()
      console.log('🚀 ~ file: import.ts:23 ~ action ~ sender:', sender)
      console.log('🚀 ~ file: import.ts:22 ~ action ~ data:', data)

      // const stream = await openai.chat.completions.create({
      //   model: 'gpt-4',
      //   messages: [{ role: 'user', content: `${prompt}: ${emailBody}` }],
      //   stream: true,
      // })
      // for await (const chunk of stream) {
      //   console.log('??', chunk.choices[0]?.delta?.content)
      //   process.stdout.write(chunk.choices[0]?.delta?.content || '')
      // }

      // const res = await axios.post(
      //   'https://api.openai.com/v1/chat/completions',
      //   {
      //     model: 'gpt-3.5-turbo',
      //     messages: [{ role: 'user', content: `${prompt}: ${emailBody}` }],
      //     temperature: 0.2,
      //     stream: true,
      //   },
      //   {
      //     headers: {
      //       Accept: 'application/json',
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${apiKey}`,
      //     },
      //   }
      // )
      // console.log('🚀 ~ file: import.ts:39 ~ action ~ res:', res)

      // const { choices } = res.data
      // const suggestion = JSON.parse(choices[0].message.content)
      // console.log('🚀 ~ file: import.ts:41 ~ action ~ suggestion:', suggestion)

      return json({ success: true }, 200)
    }
  }
}
