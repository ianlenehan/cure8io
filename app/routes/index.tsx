import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import { signOut, getUserSession } from "~/utils/session.server";

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "Cure8",
    description:
      "Cureate content for you and your friends from anywhere on the web!",
  };
};

export let action = ({ request }: { request: Request }) => {
  return signOut(request);
};

export let loader = async ({ request }: { request: Request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login");
  }

  return null;
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <div className="remix__page">
      <main>
        <h2>Welcome to Remix Firebase demo</h2>

        <Form method="post">
          <button type="submit">Sign Out</button>
        </Form>
      </main>
    </div>
  );
}
