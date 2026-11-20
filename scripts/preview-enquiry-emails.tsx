import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { render, toPlainText } from "react-email";
import { ProjectEnquiryEmail } from "../emails/project-enquiry";

async function main() {
  const directory = join(process.cwd(), "tmp", "email-previews");
  await mkdir(directory, { recursive: true });
  for (const acknowledgement of [false, true]) {
    const name = acknowledgement ? "customer-acknowledgement" : "team-notification";
    const html = await render(<ProjectEnquiryEmail {...ProjectEnquiryEmail.PreviewProps} acknowledgement={acknowledgement} />);
    await writeFile(join(directory, `${name}.html`), html);
    await writeFile(join(directory, `${name}.txt`), toPlainText(html));
    console.log(`Rendered ${join(directory, `${name}.html`)}`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
