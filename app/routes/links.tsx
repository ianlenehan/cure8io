import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link as RouterLink, useFetcher } from '@remix-run/react'
import { Box, Button, useBoolean, useToast } from '@chakra-ui/react'
import invariant from 'tiny-invariant'

import { PageHeader, PageContent, LinkCard, ZeroState } from '~/components'

import { getSupabaseSession } from '~/api/auth.server'
import { useEffect } from 'react'

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const action = formData.get('action') as string | undefined

  const { session, supabase, response } = await getSupabaseSession(request)
  invariant(session, 'You must be logged in to complete this action')

  if (action === 'interact') {
    const linkId = formData.get('linkId') as string

    await supabase
      .from('interactions')
      .upsert({ id: linkId, user_id: session.user.id, link_id: linkId, action: 'click' })

    return json({}, { headers: response.headers })
  }

  if (action === 'delete') {
    try {
      const linkId = formData.get('linkId') as string
      await supabase.from('curated_links').delete().eq('id', linkId)
      return json({}, { status: 200, headers: response.headers })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred prunging this link'
      return json({ error: errorMessage }, { status: 500, headers: response.headers })
    }
  }

  return json({}, { headers: response.headers })
}

export const loader = async ({ request }: LoaderArgs) => {
  const { session, response, supabase } = await getSupabaseSession(request)

  if (!session) {
    return redirect('/login')
  }

  // const { data: posts, error: postsError } = await supabase.from('subscriptions').select('*')
  const { data: links, error: linksError } = await supabase
    .from('curated_links')
    .select(`*, newsletters(*), issues(*)`)
    .eq('user_id', session.user.id)
    .eq('status', 'curated')
    .order('created_at', { ascending: false })

  if (linksError) {
    throw new Error(linksError.message)
  }

  const linkIds = links.map((l) => l?.id).filter(Boolean)
  const { data: interactions } = await supabase
    .from('interactions')
    .select('*')
    .in('link_id', linkIds)
    .eq('user_id', session.user.id)

  return json({ links, interactions }, { headers: response.headers })
}

/* 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 */

export default function Links() {
  const { links, interactions } = useLoaderData<typeof loader>()

  const [isPruning, setPruning] = useBoolean()
  const toast = useToast()

  const fetcher = useFetcher()
  const deletionError = fetcher.data?.error

  useEffect(() => {
    if (deletionError) {
      toast({
        title: 'Error',
        description: deletionError,
        status: 'error',
        duration: 5000,
      })
    }
  }, [deletionError, toast])

  return (
    <Box height="100%">
      <PageHeader title="Links">
        <Button
          colorScheme={isPruning ? 'red' : 'green'}
          onClick={setPruning.toggle}
          variant={isPruning ? 'outline' : 'solid'}
        >
          {isPruning ? 'Stop Pruning' : 'Prune Links'}
        </Button>
      </PageHeader>

      <PageContent>
        {!links?.length ? (
          <ZeroState title="Nothing here yet!" subtitle="Subscribe to some lists to start seeing posts in your feed!">
            <Box marginTop="24px">
              <Button as={RouterLink} colorScheme="brand" to="/discover" size="md" variant="outline">
                Discover lists
              </Button>
            </Box>
          </ZeroState>
        ) : (
          <Box padding={4} w="100%" sx={{ columnCount: [1, 2], columnGap: '12px' }} mx="auto">
            {links.map((link) =>
              link ? (
                <LinkCard
                  isClicked={interactions?.some((i) => i.link_id === link.id)}
                  isDeleting={
                    fetcher.submission?.formData?.get('action') === 'delete' &&
                    fetcher.submission?.formData?.get('linkId') === link.id
                  }
                  isPruning={isPruning}
                  key={link.id}
                  link={link}
                  mb="12px"
                  onPrune={() => fetcher.submit({ linkId: link.id, action: 'delete' }, { method: 'POST' })}
                  onClick={() => fetcher.submit({ linkId: link.id, action: 'interact' }, { method: 'POST' })}
                />
              ) : null
            )}
          </Box>
        )}
      </PageContent>
    </Box>
  )
}
