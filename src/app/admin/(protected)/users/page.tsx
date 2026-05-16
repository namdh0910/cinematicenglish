import { getUsers } from "@/app/admin/actions";
import UsersClient from "./UsersClient";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
  const plan = typeof searchParams.plan === 'string' ? searchParams.plan : undefined;
  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined;

  const users = await getUsers({ query, plan, status });

  return <UsersClient initialUsers={users} />;
}
