import { useEffect } from "react";

export interface SeoFaq {
  question: string;
  answer: string;
}

interface Props {
  title: string;
  description: string;
  canonicalPath: string;
  keywords: string[];
  faqs: SeoFaq[];
  features?: string[];
}

const siteUrl = "https://opticthirst.com";

const defaultFeatures = [
  "Convert ZIP archives to 7z format",
  "Preserve folders and filenames",
  "Process files in your browser",
];

const ToolSeo = ({ title, description, canonicalPath, keywords, faqs, features = defaultFeatures }: Props) => {
  useEffect(() => {
    const previousTitle = document.title;
    const changedAttributes: Array<{ element: Element; attribute: string; previousValue: string | null; created: boolean }> = [];

    const updateHeadElement = (
      selector: string,
      tagName: "meta" | "link",
      identifyingAttribute: string,
      identifyingValue: string,
      attribute: string,
      value: string,
    ) => {
      let element = document.head.querySelector(selector);
      const created = !element;
      if (!element) {
        element = document.createElement(tagName);
        element.setAttribute(identifyingAttribute, identifyingValue);
        document.head.appendChild(element);
      }

      changedAttributes.push({ element, attribute, previousValue: element.getAttribute(attribute), created });
      element.setAttribute(attribute, value);
    };

    const canonicalUrl = `${siteUrl}${canonicalPath}`;
    updateHeadElement('meta[name="description"]', "meta", "name", "description", "content", description);
    updateHeadElement('meta[name="keywords"]', "meta", "name", "keywords", "content", keywords.join(", "));
    updateHeadElement('meta[name="robots"]', "meta", "name", "robots", "content", "index,follow,max-image-preview:large");
    updateHeadElement('meta[property="og:title"]', "meta", "property", "og:title", "content", title);
    updateHeadElement('meta[property="og:description"]', "meta", "property", "og:description", "content", description);
    updateHeadElement('meta[property="og:type"]', "meta", "property", "og:type", "content", "website");
    updateHeadElement('meta[property="og:url"]', "meta", "property", "og:url", "content", canonicalUrl);
    updateHeadElement('meta[property="og:site_name"]', "meta", "property", "og:site_name", "content", "OpticThirst");
    updateHeadElement('meta[property="og:locale"]', "meta", "property", "og:locale", "content", "en_US");
    updateHeadElement('meta[name="twitter:card"]', "meta", "name", "twitter:card", "content", "summary");
    updateHeadElement('meta[name="twitter:title"]', "meta", "name", "twitter:title", "content", title);
    updateHeadElement('meta[name="twitter:description"]', "meta", "name", "twitter:description", "content", description);
    updateHeadElement('link[rel="canonical"]', "link", "rel", "canonical", "href", canonicalUrl);

    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.dataset.toolSeo = "true";
    structuredData.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: title,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript and a modern browser",
        url: canonicalUrl,
        description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: features,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
          { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
        ],
      },
    ]);
    document.head.appendChild(structuredData);
    document.title = title;

    return () => {
      document.title = previousTitle;
      structuredData.remove();
      changedAttributes.forEach(({ element, attribute, previousValue, created }) => {
        if (created) element.remove();
        else if (previousValue === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, previousValue);
      });
    };
  }, [title, description, canonicalPath, keywords, faqs, features]);

  return null;
};

export default ToolSeo;