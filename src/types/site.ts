export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  positioningStatement: string;
  description: string;
  language: "tr";
  locale: "tr_TR";
  siteUrl: string;
  contact: {
    email: string | null;
    phone: string | null;
    location: string;
    availabilityText: string;
  };
  socialLinks: readonly SocialLink[];
  copy: {
    hero: SectionCopy & {
      primaryActionLabel: string;
      secondaryActionLabel: string;
      scrollLabel: string;
      visualAlt: string;
    };
    featuredProjects: SectionCopy;
    philosophy: SectionCopy;
    services: SectionCopy;
    packages: SectionCopy;
    about: SectionCopy;
    contact: SectionCopy & {
      responseNote: string;
    };
    footer: {
      statement: string;
      contentNotice: string;
    };
  };
}
