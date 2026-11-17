import Link from "next/link";
import { paths } from "./site-routes";
import styles from "./service-coverage.module.css";

type CoverageRegion = {
  id: string;
  name: string;
  kind: "core" | "auckland" | "wider";
  description: string;
  locationLabel: string;
  locations: readonly string[];
};

export const coverageRegions = [
  {
    id: "south-auckland",
    name: "South Auckland",
    kind: "core",
    description: "Our home region, with Manurewa at the heart of our Auckland coverage.",
    locationLabel: "Representative enquiry locations",
    locations: [
      "Manurewa", "Manukau", "Papakura", "Takanini", "Papatoetoe", "Māngere",
      "Māngere Bridge", "Wiri", "Clendon Park", "Weymouth", "Wattle Downs",
      "The Gardens", "Tōtara Heights", "Conifer Grove",
    ],
  },
  {
    id: "east-auckland",
    name: "East Auckland",
    kind: "auckland",
    description: "Enquiries from the eastern suburbs are welcome as part of our Auckland service area.",
    locationLabel: "Representative suburbs",
    locations: [
      "Howick", "Pakuranga", "Botany", "East Tāmaki", "Dannemora", "Somerville",
      "Bucklands Beach", "Half Moon Bay",
    ],
  },
  {
    id: "central-auckland",
    name: "Central Auckland",
    kind: "auckland",
    description: "Talk with us about a building project on the Auckland isthmus.",
    locationLabel: "Representative suburbs",
    locations: [
      "Mount Eden", "Epsom", "Remuera", "Ellerslie", "Onehunga", "Greenlane",
      "Mount Albert", "Point Chevalier",
    ],
  },
  {
    id: "west-auckland",
    name: "West Auckland",
    kind: "auckland",
    description: "Our Auckland coverage also extends west, including the New Lynn area.",
    locationLabel: "Representative suburbs",
    locations: [
      "New Lynn", "Glen Eden", "Titirangi", "Henderson", "Te Atatū South",
      "Te Atatū Peninsula", "Massey", "West Harbour",
    ],
  },
  {
    id: "north-auckland",
    name: "North Auckland & the North Shore",
    kind: "auckland",
    description: "We welcome enquiries from across the North Shore and northern Auckland suburbs.",
    locationLabel: "Representative suburbs",
    locations: [
      "Albany", "Glenfield", "Birkenhead", "Northcote", "Takapuna", "Milford",
      "Devonport", "Browns Bay",
    ],
  },
  {
    id: "waikato",
    name: "Hamilton & Waikato",
    kind: "wider",
    description: "Planning a project in Hamilton or elsewhere in Waikato? Contact us to discuss the location, scope and timing.",
    locationLabel: "Representative Hamilton suburbs and Waikato towns",
    locations: [
      "Rototuna", "Flagstaff", "Chartwell", "Huntington", "Hamilton East",
      "Hillcrest", "Dinsdale", "Te Rapa",
      "Cambridge", "Te Awamutu", "Ngāruawāhia", "Huntly", "Morrinsville",
    ],
  },
  {
    id: "whangarei",
    name: "Whangārei",
    kind: "wider",
    description: "We also welcome enquiries from Whangārei. Let’s discuss your project and confirm availability for the proposed work.",
    locationLabel: "Representative Whangārei suburbs",
    locations: [
      "Te Kamo", "Tikipunga", "Kensington", "Regent", "Maunu", "Onerahi",
      "Morningside", "Raumanga",
    ],
  },
] as const satisfies readonly CoverageRegion[];

const coverageQuestions = [
  {
    question: "Do you take on projects outside Auckland?",
    answer: "We welcome enquiries from Waikato and Whangārei. Share your project location, the work you have in mind and your preferred timing so we can discuss availability and the next steps.",
  },
  {
    question: "Does my project need to be a certain size?",
    answer: "Send us a brief outline of what you want to build or change, together with the approximate project size and location. We’ll discuss whether the proposed work is a suitable fit and how we may be able to help.",
  },
  {
    question: "What should I include in my enquiry?",
    answer: "Include your suburb or town, the service you need, approximate project size and preferred timing. If you have plans or building consent documents, you can attach them to the enquiry form to help us understand the work.",
  },
];

export function CoverageSection({ service, expanded = false }: { service?: string; expanded?: boolean }) {
  return (
    <section className={`${styles.section} ${expanded ? styles.expanded : ""}`} aria-label="Building service areas">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>{service || "Our service areas"}</p>
            <h2>Auckland, Waikato &amp; Whangārei</h2>
          </div>
          <p className={styles.lead}>
            We’re based in South Auckland and work across the Auckland region.
            We also welcome project enquiries from Waikato and Whangārei.
          </p>
        </header>

        <p className={styles.explanation}>
          The places below are representative enquiry locations within our service regions.
          Tell us your project’s size, location and preferred timing so we can confirm availability.
        </p>

        <div className={styles.regionGrid}>
          {coverageRegions.map((region) => (
            <article className={`${styles.region} ${region.kind === "core" ? styles.core : ""} ${region.kind === "core" || region.id === "waikato" ? styles.wide : ""}`} key={region.id}>
              {region.kind === "core" && <p className={styles.regionLabel}>Our home region</p>}
              {region.kind === "wider" && <p className={styles.regionLabel}>Wider project enquiries</p>}
              <h3>{region.name}</h3>
              <p className={styles.regionDescription}>{region.description}</p>
              <p className={styles.locationLabel}>{region.locationLabel}</p>
              <ul className={styles.locations} aria-label={region.locationLabel}>
                {region.locations.map((location) => <li key={location}>{location}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.nextStep}>
          <div>
            <h3>Tell us where you’re planning to build</h3>
            <p>Share a few details and we’ll discuss your project with you.</p>
          </div>
          <div className={styles.actions}>
            <Link className="cta-button" href={paths.contact}>DISCUSS YOUR PROJECT</Link>
            {!expanded && <Link className={styles.textLink} href={paths.serviceAreas}>More about our service areas</Link>}
          </div>
        </div>

        {expanded && (
          <>
            <section className={styles.projectSection} aria-label="Auckland building projects">
              <div>
                <p className={styles.eyebrow}>Explore our work</p>
                <h2>Auckland homes we’ve built</h2>
                <p>See the scope and photographs of these projects.</p>
              </div>
              <nav className={styles.projectLinks} aria-label="Featured building projects">
                <Link href={paths.whitford}>Whitford Heights</Link>
                <Link href={paths.manukau}>Manukau Heights</Link>
                <Link href={paths.botany}>Botany</Link>
                <Link href={paths.newLynn}>New Lynn</Link>
                <Link href={paths.projects}>View all projects</Link>
              </nav>
            </section>

            <section className={styles.faqSection} aria-label="Service area questions">
              <h2>Planning a project in your area?</h2>
              <div className={styles.faqGrid}>
                {coverageQuestions.map((item) => (
                  <div key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
}
