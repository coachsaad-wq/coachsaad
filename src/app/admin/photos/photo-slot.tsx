"use client";

import { useActionState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { uploadPhotoAction, type UploadPhotoState } from "@/lib/actions/admin/photos";

const initialState: UploadPhotoState = {};

export function PhotoSlot({
  targetKey,
  label,
  currentPath,
}: {
  targetKey: string;
  label: string;
  currentPath: string | null;
}) {
  const [state, formAction, pending] = useActionState(uploadPhotoAction, initialState);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-4">
      <div className="relative h-32 w-full overflow-hidden rounded-md bg-mist">
        {currentPath ? (
          <Image src={currentPath} alt={label} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink">{label}</p>

      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="targetKey" value={targetKey} />
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="text-xs"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-red px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-60"
        >
          {pending ? "Envoi..." : "Remplacer"}
        </button>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
        {state.success && <p className="text-xs text-green-600">Photo mise à jour.</p>}
      </form>
    </div>
  );
}
