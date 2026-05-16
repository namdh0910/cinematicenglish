import { getStories } from "@/app/admin/actions";
import StoriesClient from "./StoriesClient";

export const dynamic = 'force-dynamic';

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;

  const stories = await getStories({ query, category, status, sort });

  return <StoriesClient initialStories={stories} />;
}
