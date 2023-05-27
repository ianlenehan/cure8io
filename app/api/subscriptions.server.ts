import invariant from 'tiny-invariant'
import createServerSupabase from '~/utils/supabase.server'

export const getSubscriptions = async (request: Request) => {
  const response = new Response()
  const supabase = createServerSupabase({ request, response })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  invariant(user, 'You must be signed in to perform this action.')

  const { data: subscriptions, error } = await supabase.from('subscriptions').select('*').eq('subscriber_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  return { subscriptions, response }
}

export const toggleSubscription = async (request: Request, action: 'subscribe' | 'unsubscribe', listId: string) => {
  const response = new Response()
  const supabase = createServerSupabase({ request, response })
  let error = ''

  const {
    data: { user },
  } = await supabase.auth.getUser()

  invariant(user, 'You must be signed in to perform this action.')

  if (action === 'subscribe') {
    const { error: subscribeError } = await supabase
      .from('subscriptions')
      .insert({ subscriber_id: user.id, list_id: listId })

    if (subscribeError) {
      error = 'There was an error subscribing to this list. Please try again.'
    }
  }

  if (action === 'unsubscribe') {
    const { error: unsubscribeError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('subscriber_id', user.id)
      .eq('list_id', listId)

    if (unsubscribeError) {
      error = 'There was an error removing your subscription. Please try again.'
    }
  }

  return { error, response }
}
