import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0">
      <span className="relative block h-14 w-10 shrink-0">
        <Image
          src="/images/coach/logo-coach-saad.png"
          alt="Coach Saad"
          fill
          sizes="40px"
          className="object-contain object-top"
          priority
        />
      </span>
      <span
        className={clsx(
          "flex flex-col leading-[0.95] font-extrabold tracking-tight uppercase text-sm",
          dark ? "text-white" : "text-ink"
        )}
      >
        <span>Coach</span>
        <span className="text-brand-red">Saad</span>
      </span>
    </Link>
  );
}
