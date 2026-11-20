import { Body, Button, Container, Head, Heading, Html, Hr, Link, Preview, Section, Tailwind, Text, pixelBasedPreset } from "react-email";
import type { ContactFields } from "../lib/contact-validation";

export type EnquiryEmailProps = { enquiry: ContactFields; businessEmail: string; phone: string; attachments: string[]; acknowledgement?: boolean };

export function ProjectEnquiryEmail({ enquiry, businessEmail, phone, attachments, acknowledgement = false }: EnquiryEmailProps) {
  const reference = enquiry.requestId.slice(0, 8).toUpperCase();
  const details = acknowledgement
    ? [["Service", enquiry.service], ["Project size", enquiry.size], ["Reference", reference]]
    : [["Name", `${enquiry.firstName} ${enquiry.lastName}`], ["Email", enquiry.email], ["Phone", enquiry.phone], ["Service", enquiry.service], ["Project size", enquiry.size], ["Reference", reference]];
  return <Html lang="en-NZ" dir="ltr"><Tailwind config={{ presets: [pixelBasedPreset] }}><Head /><Body className="m-0 bg-[#f5f9ff] p-[16px] font-sans text-[#183a72]">
    <Preview>{acknowledgement ? "Thanks for getting in touch. Our building team has received your enquiry." : `New website enquiry: ${enquiry.service}`}</Preview>
    <Container className="mx-auto w-full max-w-[600px] bg-white">
      <Section className="border-0 border-t-[6px] border-solid border-[#5e8fe0] bg-[#183a72] px-[28px] py-[24px]">
        <Text className="m-0 text-[20px] font-bold leading-[26px] tracking-[1px] text-white">ON SITE BUILDING<br />CONSTRUCTION</Text>
        <Text className="mb-0 mt-[8px] text-[14px] leading-[20px] text-[#c7dcff]">Built around the way you live.</Text>
      </Section>
      <Section className="px-[28px] py-[28px]">
        <Text className="mb-[12px] mt-0 text-[12px] font-bold tracking-[2px] text-[#183a72]">{acknowledgement ? "THANK YOU FOR GETTING IN TOUCH" : "NEW WEBSITE ENQUIRY"}</Text>
        <Heading as="h1" className="mb-[20px] mt-0 text-[28px] font-bold leading-[36px] text-[#183a72]">{acknowledgement ? "Your project starts here." : "Let’s talk about a new project."}</Heading>
        <Text className="text-[16px] leading-[26px] text-[#17233a]">{acknowledgement ? `Hi ${enquiry.firstName}, thanks for contacting On Site Building Construction. We’ve received your enquiry and our team will be in touch to discuss your plans.` : "A visitor has sent a project enquiry through the website. Reply to this email to speak with them directly."}</Text>
        <Section className="my-[24px] border-0 border-l-[4px] border-solid border-[#5e8fe0] bg-[#f5f9ff] px-[20px] py-[12px]">
          {details.map(([label, value]) => <Text className="my-[10px] text-[15px] leading-[23px] text-[#17233a]" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }} key={label}><strong>{label}</strong><br />{value}</Text>)}
        </Section>
        {!acknowledgement && <>
          <Heading as="h2" className="mb-[12px] mt-[24px] text-[20px] font-bold text-[#183a72]">Project details</Heading>
          <Text className="text-[16px] leading-[26px] text-[#17233a]" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", wordBreak: "break-word" }}>{enquiry.message}</Text>
          {attachments.length > 0 && <><Heading as="h2" className="text-[20px] font-bold text-[#183a72]">Attached plans and images</Heading>{attachments.map((filename, index) => <Text key={index} className="my-[6px] text-[15px] leading-[24px] text-[#17233a]" style={{ overflowWrap: "anywhere" }}>{filename}</Text>)}</>}
          <Text className="text-[14px] leading-[22px] text-[#17233a]">Submitted from <Link href={`https://onsitebuild.co.nz${enquiry.sourcePath}`} className="text-[#183a72] underline">the website</Link>. The sender agreed to the form’s terms and conditions.</Text>
        </>}
        <Button href={`mailto:${acknowledgement ? businessEmail : enquiry.email}`} className="box-border bg-[#183a72] px-[24px] py-[15px] text-center text-[16px] font-bold text-white no-underline">{acknowledgement ? "Contact our team" : "Reply to enquiry"}</Button>
        {acknowledgement && <Text className="mb-0 mt-[24px] text-[15px] leading-[24px] text-[#17233a]">Need to add something? Reply to this email or call <Link href={`tel:${phone.replace(/\s/g, "")}`} className="text-[#183a72] underline">{phone}</Link>. We’re happy to help.</Text>}
      </Section>
      <Section className="bg-[#5e8fe0] px-[28px] py-[24px]"><Heading as="h2" className="m-0 text-[20px] font-bold leading-[28px] text-[#183a72]">Built with care.<br />Delivered with experience.</Heading></Section>
      <Section className="bg-[#f5f9ff] px-[28px] py-[20px]"><Text className="m-0 text-[13px] leading-[22px] text-[#183a72]">On Site Building Construction<br />Auckland, Waikato &amp; Whangārei</Text><Hr className="my-[16px] border-0 border-t border-solid border-[#d8e3f4]" /><Text className="m-0 text-[13px] leading-[22px] text-[#183a72]"><Link href="https://onsitebuild.co.nz" className="text-[#183a72] underline">Visit our website</Link><br />{acknowledgement ? "This email confirms a project enquiry made through our website. If you didn’t make an enquiry, you can ignore it." : "This project enquiry was sent through the On Site Building Construction website."}</Text></Section>
    </Container>
  </Body></Tailwind></Html>;
}

ProjectEnquiryEmail.PreviewProps = {
  enquiry: { firstName: "Alex", lastName: "Taylor", email: "alex@example.com", phone: "021 123 4567", service: "Renovations & Alterations", size: "50 sqm", message: "We’re planning a kitchen renovation and would like to discuss the layout, budget and next steps.\nWe have attached our initial plans.", sourcePath: "/contact-auckland-builders", requestId: "c6e502e2-f3cf-4b29-81bb-24650402e222", startedAt: 1 },
  businessEmail: "onsitebuilding1@gmail.com", phone: "021 715 196", attachments: ["kitchen-plans.pdf"],
} satisfies EnquiryEmailProps;

export default ProjectEnquiryEmail;
