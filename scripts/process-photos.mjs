// Traitement des photos originales de Coach Saad.
// Règle absolue : AUCUNE retouche de visage, AUCUNE génération IA,
// AUCUNE transformation de la personne. Seuls redimensionnement et
// recadrage géométrique (position fixe, sans IA) sont appliqués.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const SOURCE_DIR = path.join(os.homedir(), "Desktop", "photo saad");
const OUT_DIR = path.join(import.meta.dirname, "..", "public", "images", "coach");

const jobs = [
  {
    source: "IMG_20260723_135234.JPG",
    out: "hero-action.jpg",
    width: 900,
    height: 1200,
    gravity: "north",
  },
  {
    source: "IMG_20260723_135234.JPG",
    out: "program-prise-de-muscle.jpg",
    width: 800,
    height: 600,
    gravity: "north",
  },
  {
    source: "IMG_20260802_084456.JPG",
    out: "about-portrait.jpg",
    width: 1000,
    height: 1200,
    gravity: "center",
  },
  {
    source: "IMG_20260827_172310.JPG",
    out: "program-perte-de-poids.jpg",
    width: 800,
    height: 600,
    gravity: "center",
  },
  {
    source: "Messenger_creation_C90DCCC0-27DC-4F79-BF14-3C3A13EF0B38.JPEG",
    out: "program-cardio-hiit.jpg",
    width: 800,
    height: 600,
    gravity: "south",
  },
  {
    source: "Messenger_creation_DC761493-EB6F-491C-A9F5-F535EFD84BA5.JPEG",
    out: "program-nutrition.jpg",
    width: 800,
    height: 600,
    gravity: "center",
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const job of jobs) {
    const src = path.join(SOURCE_DIR, job.source);
    const dest = path.join(OUT_DIR, job.out);

    await sharp(src)
      .resize(job.width, job.height, { fit: "cover", position: job.gravity })
      .jpeg({ quality: 88 })
      .toFile(dest);

    console.log(`OK  ${job.source} -> images/coach/${job.out} (${job.width}x${job.height}, recadrage: ${job.gravity})`);
  }

  console.log("\nTerminé. Aucune modification de visage, aucune génération IA — uniquement redimensionnement/recadrage.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
