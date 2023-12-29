import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData, Link as RouterLink, useFetcher } from '@remix-run/react'
import { Box, Button, Card, CardBody } from '@chakra-ui/react'
import invariant from 'tiny-invariant'

import { PageHeader, LinkCard, ZeroState } from '~/components'

import { getSupabaseSession } from '~/api/auth.server'

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
    .select(`*, newsletters(name), issues(issue_number, date)`)
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

  const fetcher = useFetcher()

  return (
    <Box height="100%">
      <PageHeader title="Links" />
      <Card maxWidth="960px" variant="outline">
        <CardBody>
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
                    key={link.id}
                    isClicked={interactions?.some((i) => i.link_id === link.id)}
                    link={link}
                    mb="12px"
                    onClick={() => fetcher.submit({ linkId: link.id, action: 'interact' }, { method: 'POST' })}
                  />
                ) : null
              )}
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  )
}
