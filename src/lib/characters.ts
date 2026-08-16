export type Character = {
  slug: string;
  name: string;
  title: string;
  blurb: string;
  image: string;
  color: string;
};

export const characters: Character[] = [
  {
    slug: "sprout",
    name: "Sprout",
    title: "The Shy Forager",
    blurb: "Never leaves the burrow without two glowing carrots and a triple-cap hat.",
    image: "/hood-sprout.jpg",
    color: "#8CFF6B",
  },
  {
    slug: "corsair",
    name: "Corsair",
    title: "The Tide Raider",
    blurb: "Crowned in bioluminescent coral, hunts the reef line at low tide.",
    image: "/hood-corsair.jpg",
    color: "#3EDBF0",
  },
  {
    slug: "elixir",
    name: "Elixir",
    title: "The Potion Brewer",
    blurb: "Bottled up and buzzing, this one's caffeinated on pure mushroom magic.",
    image: "/hood-elixir.jpg",
    color: "#FF3EA5",
  },
  {
    slug: "forager",
    name: "Forager",
    title: "The Original",
    blurb: "First of the hood. Spotted cap, big eyes, bigger appetite for carrots.",
    image: "/hood-forager.jpg",
    color: "#B026FF",
  },
  {
    slug: "tidal",
    name: "Tidal",
    title: "The Reef Wanderer",
    blurb: "Grew a whole anemone on its head and decided that was a personality now.",
    image: "/hood-tidal.jpg",
    color: "#39FF14",
  },
];
