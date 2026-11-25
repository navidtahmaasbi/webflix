import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { Catalog } from "~/components/catalog";
import titles from "~/data/demo-shows.json";

export const loader: LoaderFunction = ({ params }) => {
  const title = titles.find((item) => item.objectID === params.itemId);
  if (!title) throw new Response("Not found", { status: 404 });
  return { id: title.objectID };
};
export default function TitlePage() {
  const { id } = useLoaderData<{ id: string }>();
  return <Catalog initialTitle={id} />;
}
