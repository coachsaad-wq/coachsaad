import { requireUser } from "@/lib/auth/session";
import { AccountNav } from "@/components/client/account-nav";

export default async function MonCompteLayout({ children }: LayoutProps<"/mon-compte">) {
  const user = await requireUser();

  return (
    <section className="container-page py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          Espace client
        </span>
        <h1 className="mt-1 text-2xl font-extrabold uppercase tracking-tight text-ink">
          Bonjour {user.firstName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[16rem_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
