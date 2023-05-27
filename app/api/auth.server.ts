import createServerSupabase from '~/utils/supabase.server'

export const getSupabaseSession = async (request: Request) => {
  try {
    const response = new Response()
    const supabase = createServerSupabase({ request, response })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return { session, supabase, response }
  } catch (error) {
    console.log('🚀 ~ file: auth.server.ts:14 ~ getSupabaseSession ~ error:', error)
    throw new Error('There was an error getting your session. Please try again.')
  }
}
