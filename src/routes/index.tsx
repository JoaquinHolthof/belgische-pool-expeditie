import { createFileRoute } from "@tanstack/react-router";
import { ExpeditionTouchwall } from "../components/ExpeditionTouchwall";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Belgica Expedition Touchwall" },
      {
        name: "description",
        content: "An interactive museum touchwall tracing the 1897 Belgica expedition from Antwerp to Antarctica.",
      },
      { property: "og:title", content: "Belgica Expedition Touchwall" },
      {
        property: "og:description",
        content: "A cinematic 3D globe experience for the Antarctic Belgica expedition.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <ExpeditionTouchwall />;
}