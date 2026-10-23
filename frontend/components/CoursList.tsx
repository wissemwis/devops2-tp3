"use client";

import { useEffect, useState } from "react";
import CoursCard from "@/components/CoursCard";
import CoursFilters from "@/components/CoursFilters";
import { filterCours, sortBySession, LEVEL_LABELS, type Cours, type LevelFilter } from "@/lib/cours";

function describeResults(count: number, query: string, level: LevelFilter): string {
  if (count === 0) {
    if (query !== "") {
      if (level !== "tous") {
        return `Aucun cours de niveau ${LEVEL_LABELS[level].toLowerCase()} ne correspond à « ${query} ».`;
      } else {
        return `Aucun cours ne correspond à « ${query} ».`;
      }
    } else {
      if (level !== "tous") {
        return `Aucun cours de niveau ${LEVEL_LABELS[level].toLowerCase()}.`;
      } else {
        return "Aucun cours disponible.";
      }
    }
  } else {
    if (count === 1) {
      return "1 cours";
    } else {
      return `${count} cours`;
    }
  }
}

export default function CoursList({ cours }: { cours: Cours[] }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("tous");
  const visibles = filterCours(cours, { query, level });

  return (
    <>
      <CoursFilters query={query} level={level} onQueryChange={setQuery} onLevelChange={setLevel} />
      <p className="results" aria-live="polite">
        {describeResults(visibles.length, query.trim(), level)}
      </p>
      {visibles.length > 0 && (
        <ul className="cards cours-grid" aria-label="Liste des cours">
          {visibles.map((c) => (
            <li key={c.documentId}>
              <CoursCard cours={c} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
