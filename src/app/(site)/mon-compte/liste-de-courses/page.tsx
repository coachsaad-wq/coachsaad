import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function ListeDeCoursesPage() {
  const user = await requireUser();
  const profile = await prisma.nutritionProfile.findUnique({
    where: { userId: user.id },
    include: { programs: { where: { isCurrent: true }, take: 1 } },
  });
  const program = profile?.programs[0];
  const shoppingList = (program?.shoppingList as unknown as string[] | undefined) ?? [];

  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-ink">
        <ShoppingCart className="h-4 w-4" /> Ma liste de courses
      </h2>

      {shoppingList.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2 max-w-sm">
          {shoppingList.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-md border border-line px-3 py-2.5 text-sm text-ink-soft"
            >
              <input type="checkbox" className="h-4 w-4 accent-brand-red" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-sm text-ink-soft/70">
          Aucune liste de courses pour le moment.
          <Link href="/nutrition/abonnement" className="ml-1 font-semibold text-brand-red underline">
            Découvrir Nutrition IA
          </Link>
        </div>
      )}
    </div>
  );
}
