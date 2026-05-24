import { createFileRoute } from "@tanstack/react-router";
import { CrewAtlas } from "../components/CrewAtlas";

export const Route = createFileRoute("/crew")({
  head: () => ({
    meta: [
      { title: "Crew & Science Atlas — Belgica Expeditie 1897" },
      {
        name: "description",
        content:
          "Ontdek de bemanning en wetenschappelijke ontdekkingen van de historische Belgica-expeditie (1897–1899) naar Antarctica.",
      },
      { property: "og:title", content: "Crew & Science Atlas — Belgica Expeditie" },
    ],
  }),
  component: CrewPage,
});

function CrewPage() {
  return <CrewAtlas />;
}
