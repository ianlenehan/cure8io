// root.tsx
import { useEffect, useState, useRef } from 'react'
import { Outlet, useLoaderData, useRevalidator } from '@remix-run/react'
import { json, type LoaderArgs } from '@remix-run/node'
import { ChakraProvider } from '@chakra-ui/react'
import { type SupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/auth-helpers-remix'

import theme from './utils/chakraTheme'
import { Document, SideNav } from '~/components'
import { getSupabaseSession } from './api/auth.server'
import type { Database } from 'db_types'

import styles from '~/styles/index.css'

type TypedSupabaseClient = SupabaseClient<Database>

export type SupabaseOutletContext = { supabase: TypedSupabaseClient }

export const links = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const env = {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    }

    const { session, response } = await getSupabaseSession(request)

    return json({ env, session }, { headers: response.headers })
  } catch (error) {
    console.log('🚀 ~ file: root.tsx:35 ~ loader ~ error:', error)
    // return json({ error: error.message }, { status: 500 })
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log('🚀 ~ file: root.tsx:42 ~ ErrorBoundary ~ error:', error)
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  )
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>()
  const revalidator = useRevalidator()
  const revalidateRef = useRef(0)

  const [supabase] = useState(() => createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY))

  const serverAccessToken = session?.access_token

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token === serverAccessToken) {
        revalidateRef.current = 0
        return
      }

      if (session?.access_token !== serverAccessToken && revalidateRef.current < 1) {
        // call loaders
        revalidator.revalidate()
        revalidateRef.current += 1
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, serverAccessToken, revalidator])

  return (
    <Document>
      <ChakraProvider {...{ theme }}>
        <SideNav currentUser={session?.user}>
          <Outlet context={{ supabase }} />
        </SideNav>
      </ChakraProvider>
    </Document>
  )
}
