import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "aBER",
  DESCRIPTION: "Here is aBER's Blog. Sharing my knowledge and experiences. \n aBERのブログです。私の知識と経験をシェアします。",
  EMAIL: "ab3r77724@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Hi, I'am aBER. こんにちは、aBERです。",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles, such as study notes and my thoughts. 私の知識と経験をシェアします。",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects with links to repositories and live demos. 私のプロジェクトのリンクを紹介します。",
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
