import { json, type LoaderArgs, redirect } from '@remix-run/node'
import { useOutletContext, useLoaderData, Form } from '@remix-run/react'
import { Avatar, Button, Box, FormControl, Input, FormErrorMessage, FormLabel } from '@chakra-ui/react'

import type { SupabaseOutletContext } from '~/root'
import { PageHeader, ProfileBox } from '~/components'
import { getSupabaseSession } from '~/api/auth.server'

export const loader = async ({ request }: LoaderArgs) => {
  const { session, response, supabase } = await getSupabaseSession(request)

  if (!session) {
    return redirect('/login')
  }

  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()

  if (error) {
    throw new Error(error.message)
  }

  return json({ user: session.user, profile }, { headers: response.headers })
}

export default function Profile() {
  const { user, profile } = useLoaderData<typeof loader>()
  console.log('🚀 ~ file: profile.tsx:23 ~ Profile ~ user:', { user, profile })
  const { supabase } = useOutletContext<SupabaseOutletContext>()

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  return (
    <Box height="100%">
      <PageHeader title="Profile" />

      <ProfileBox avatarUrl={profile.avatar_url} email={user.email} name={profile.name} size="lg" />
      <Button onClick={signOut}>Sign Out</Button>
    </Box>
  )
}
