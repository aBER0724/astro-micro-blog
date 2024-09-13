import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "aBER",
  DESCRIPTION: "Astro Micro is an accessible and lightweight blog.",
  EMAIL: "ab3r77724@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Astro Micro is an accessible theme for Astro.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects with links to repositories and live demos.",
};

export const SOCIALS: Socials = [
  {
    NAME: "X (Twitter)",
    HREF: "https://twitter.com/aBER0724",
  },
  {
    NAME: "GitHub",
    HREF: "https://github.com/aBER0724",
  },
  {
    NAME: "Telegram",
    HREF: "https://t.me/aber724",
  }
];
