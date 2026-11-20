import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { createPayloadClient } from "./payload-client";

// React cache deduplicates metadata/page reads only within one render, never between requests.
export const getBlogPost = cache(async (slug: string) => {
  await connection();
  return createPayloadClient().post(slug);
});

export async function getBlogPage(page = 1) {
  await connection();
  return createPayloadClient().list({ page });
}

export async function getRelatedPosts(slug: string) {
  await connection();
  return (await createPayloadClient().list({ exclude: slug, limit: 4 })).docs;
}

export async function getAllBlogPosts() {
  await connection();
  return createPayloadClient().all();
}
