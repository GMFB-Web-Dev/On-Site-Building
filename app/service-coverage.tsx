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

export function CoverageSection() {
  return (
    <section className={styles.section} aria-label="Building service areas">
      <div className="content-shell">
        <p className={styles.explanation}>
          Representative suburbs and towns are listed below. Work in Waikato and Whangārei
          is confirmed after discussing the project’s location and scope.
        </p>

        <div className={styles.regionGrid}>
          {coverageRegions.map((region) => (
            <section
              className={`${styles.region} ${region.kind === "core" ? styles.core : ""}`}
              aria-labelledby={`coverage-${region.id}`}
              key={region.id}
            >
              <header className={styles.regionHeading}>
                <h2 id={`coverage-${region.id}`}>{region.name}</h2>
                {region.kind === "core" && <p className={styles.regionLabel}>Our home region</p>}
                {region.kind === "wider" && <p className={styles.regionLabel}>Wider project enquiries</p>}
              </header>
              <ul className={styles.locations} aria-label={region.locationLabel}>
                {region.locations.map((location, index) => (
                  <li key={location}>
                    {location}
                    {index < region.locations.length - 1 && <span className={styles.locationSeparator} aria-hidden="true">|</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
