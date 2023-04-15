import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";

import type { SupabaseOutletContext } from "~/root";
import createServerSupabase from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/login");
  }

  return json({});
};

export default function Feed() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };
  return <div>Feed Page</div>;
}
