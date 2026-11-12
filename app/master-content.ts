// Website copy from docs/On Site Copy Writing.docx.
// Keep shared business information here so every page uses the master copy.
export const masterContent = {
  business: {
    name: "On Site Building Construction",
    email: "onsitebuilding1@gmail.com",
    phone: "021 715 196",
    phoneHref: "tel:021715196",
    serviceAreas: "Auckland, Waikato & Whangārei",
  },
  hero: {
    title: "BUILT AROUND THE WAY YOU LIVE.",
    description: "From renovations and extensions to new builds, On Site Building Construction brings over 30 years of experience to every project. We also offer complete design-and-build services throughout Auckland, Waikato and Whangārei.",
  },
  about: {
    title: "ABOUT ON SITE BUILDING CONSTRUCTION",
    paragraphs: [
      "Founded in 2003, On Site Building Construction draws on building experience dating back to 1994, with practical skills and care. With strong roots in South Auckland, the business has built its reputation through hard work, experience and word-of-mouth referrals.",
      "From transforming existing homes to building new ones, we take pride in understanding what our clients want to achieve. We believe good communication, honest advice and a practical approach make all the difference throughout the building journey.",
      "Working alongside a trusted network of builders and specialist trades, we bring the experience and people needed to see each project through, with a genuine commitment to delivering a result our clients are happy with.",
    ],
  },
  services: {
    title: "OUR SERVICES",
    description: "From renovations to new builds, we bring experience to every project.",
    labels: {
      renovations: "RENOVATIONS & ALTERATIONS",
      newBuilds: "RESIDENTIAL NEW BUILDS",
      designBuild: "DESIGN & BUILD",
      extensions: "ADDITIONS & EXTENSIONS",
      commercial: "LIGHT COMMERCIAL CONSTRUCTION",
    },
  },
  work: { title: "OUR WORK" },
  testimonials: {
    title: "TESTIMONIALS",
    quote: "lorem ipsum dolor sit amet consectetur adipiscing elit distinctio exercitation est laborum culpa sit qui placeat aute officia facere sed amet pariatur ex sunt esse maxime corrupti tempor enim fuga atque accusamus sint in in facilis nihil quis iusto aut quo est sit aut est dolore dolor elit adipiscing mollitia lorem ipsum dolor sit amet consectetur adipiscing elit distinctio exercitation est.",
    client: "John Doe",
  },
  certification: {
    title: "NZCB CERTIFIED. LBP EXPERTISE.",
    description: "Led by an experienced Licensed Building Practitioner (LBP) and long-standing member of New Zealand Certified Builders (NZCB), On Site Building Construction brings over 30 years of industry experience to residential and commercial builds.",
  },
  contact: {
    title: "LET’S TALK ABOUT YOUR PROJECT",
    description: "Planning a renovation, extension or new build? Tell us about your plans and let's discuss how we can bring your project to life.",
    emailLabel: "EMAIL",
    phoneLabel: "PHONE",
    areasLabel: "SERVICE AREAS",
  },
} as const;
