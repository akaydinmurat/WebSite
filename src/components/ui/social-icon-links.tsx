import { Camera } from "lucide-react";

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
                  <Camera aria-hidden="true" size={19} strokeWidth={2} />
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
