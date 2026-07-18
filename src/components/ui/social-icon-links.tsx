import { siteConfig } from "@/config/site";

import styles from "./social-icon-links.module.css";

interface SocialIconLinksProps {
  className?: string;
  label?: string;
}

export function SocialIconLinks({
  className,
  label = "Sosyal medya bağlantıları",
}: SocialIconLinksProps) {
  const rootClassName = className
    ? `social-icon-links ${styles.root} ${className}`
    : `social-icon-links ${styles.root}`;

  return (
    <nav className={rootClassName} aria-label={label}>
      <ul className={`social-icon-links-list ${styles.list}`}>
        {siteConfig.socialLinks.map((socialLink) => {
          const isInstagram = socialLink.label === "Instagram";

          return (
            <li key={socialLink.href}>
              <a
                className={`social-icon-link ${styles.link}`}
                data-social={socialLink.label.toLocaleLowerCase("tr-TR")}
                href={socialLink.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${socialLink.label} profilini yeni sekmede aç`}
              >
                {isInstagram ? (
                  <InstagramMark />
                ) : (
                  <span className={styles.linkedinGlyph} aria-hidden="true">
                    in
                  </span>
                )}
                <span className={styles.visuallyHidden}>{socialLink.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function InstagramMark() {
  return (
    <svg
      aria-hidden="true"
      className="instagram-mark"
      fill="none"
      height="19"
      viewBox="0 0 24 24"
      width="19"
    >
      <rect
        height="17"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="17"
        x="3.5"
        y="3.5"
      />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.35" cy="6.7" fill="currentColor" r="1.05" />
    </svg>
  );
}
