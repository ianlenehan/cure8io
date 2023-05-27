import createServerSupabase from "~/utils/supabase.server";

export const getSupabaseSession = async (request: Request) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session, supabase, response };
};
