import AuthGuard from '@/components/AuthGuard';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
