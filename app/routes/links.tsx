import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Grid } from "@chakra-ui/react";

import LinkCard from "~/components/LinkCard";
import { db } from "~/utils/db.server";
import { getUserSession } from "~/utils/session.server";
import { Curation, Link as LinkType } from "~/types";

export let loader = async ({ request }: { request: Request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login");
  }

  const user = await db.collection("users").doc(sessionUser.uid).get();
  const currentUser = user.data();
  if (!currentUser) {
    return redirect("/login");
  }

  const emails = [currentUser.email, ...(currentUser.emailAddresses || [])];

  const querySnapshot = await db
    .collection("curations")
    .where("userEmail", "in", emails)
    .where("status", "==", "new")
    .get();

  const linksDocList: any[] = [];
  const links: LinkType[] = [];
  const curations: Curation[] = [];

  querySnapshot.docs.forEach((doc) => {
    const curationData = doc.data() as Curation;
    const linkDoc = db.collection("links").doc(curationData.linkId);
    linksDocList.push(linkDoc);

    curations.push({ ...curationData, id: doc.id });
  });

  const linksSnapshot = await db.getAll(...linksDocList);

  linksSnapshot.forEach((doc) => {
    links.push({ ...doc.data(), id: doc.id } as LinkType);
  });

  const data = curations.map((curation) => {
    const link = links.find(({ id }) => id === curation.linkId);
    return { ...curation, ...link };
  });

  return data;
};

function Links() {
  const loaderData: (Curation & LinkType)[] = useLoaderData();

  if (!loaderData) {
    return <div>No Links</div>;
  }

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
      {loaderData.map(({ id, curatorName, image, title, url, comment }) => (
        <LinkCard
          key={id}
          {...{ id, curatorName, image, title, url, comment }}
        />
      ))}
    </Grid>
  );
}

export default Links;
