import { getAnalytics } from "@/app/admin/actions";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const range = typeof searchParams.range === 'string' ? searchParams.range : '30';
  const data = await getAnalytics(range);

  return <AnalyticsClient initialData={data} />;
}
