import { defineQuery } from "next-sanity";

const IMAGE_PROJECTION = `{
  alt,
  caption,
  crop,
  hotspot,
  asset->{
    _id,
    url,
    metadata{
      dimensions,
      lqip
    }
  }
}`;

const SEO_PROJECTION = `{
  metaTitle,
  metaDescription,
  canonicalUrl,
  noIndex,
  openGraphImage ${IMAGE_PROJECTION}
}`;

const CATEGORY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  description,
  "order": coalesce(order, 0)
}`;

const PROJECT_SUMMARY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category->${CATEGORY_PROJECTION},
  location,
  year,
  area,
  coverImage ${IMAGE_PROJECTION},
  mobileCoverImage ${IMAGE_PROJECTION},
  "featured": coalesce(featured, false),
  "order": coalesce(order, 0)
}`;

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]
    | order(coalesce(order, 9999) asc, title asc)
    ${PROJECT_SUMMARY_PROJECTION}
`);

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true && defined(slug.current)]
    | order(coalesce(order, 9999) asc, title asc)
    ${PROJECT_SUMMARY_PROJECTION}
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    description,
    category->${CATEGORY_PROJECTION},
    location,
    year,
    area,
    coverImage ${IMAGE_PROJECTION},
    mobileCoverImage ${IMAGE_PROJECTION},
    gallery[] ${IMAGE_PROJECTION},
    floorPlans[] ${IMAGE_PROJECTION},
    materials[]->{
      _id,
      title,
      category,
      description,
      hexColor,
      image ${IMAGE_PROJECTION}
    },
    beforeAfter{
      before ${IMAGE_PROJECTION},
      after ${IMAGE_PROJECTION},
      caption
    },
    "featured": coalesce(featured, false),
    "order": coalesce(order, 0),
    seo ${SEO_PROJECTION}
  }
`);

export const PROJECT_CATEGORIES_QUERY = defineQuery(`
  *[_type == "projectCategory" && defined(slug.current)]
    | order(coalesce(order, 9999) asc, title asc)
    ${CATEGORY_PROJECTION}
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)].slug.current
`);

export const SERVICES_QUERY = defineQuery(`
  *[_type == "service" && defined(slug.current)]
    | order(coalesce(order, 9999) asc, title asc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      description,
      "deliverables": coalesce(deliverables, []),
      image ${IMAGE_PROJECTION},
      "featured": coalesce(featured, false),
      "order": coalesce(order, 0),
      seo ${SEO_PROJECTION}
    }
`);

export const PACKAGES_QUERY = defineQuery(`
  *[_type == "package" && defined(slug.current)]
    | order(coalesce(order, 9999) asc, title asc){
      _id,
      title,
      "slug": slug.current,
      summary,
      description,
      scopeLabel,
      "scopeItems": coalesce(scopeItems, []),
      "examples": coalesce(examples, []),
      "presentationFormats": coalesce(presentationFormats, []),
      scopeBasis,
      "exclusions": coalesce(exclusions, []),
      image ${IMAGE_PROJECTION},
      "showOnHomepage": coalesce(showOnHomepage, false),
      "order": coalesce(order, 0),
      seo ${SEO_PROJECTION}
    }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    _id,
    brandName,
    positioningStatement,
    siteDescription,
    contactEmail,
    contactPhone,
    address,
    "socialLinks": coalesce(socialLinks, []),
    defaultSeo ${SEO_PROJECTION}
  }
`);
