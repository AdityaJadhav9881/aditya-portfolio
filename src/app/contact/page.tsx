import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ContactPageClient from "./ContactPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Aditya Jadhav.",
};

async function getContactSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, String(s.value)]));
  return {
    email: map.email || "",
    linkedin: map.linkedin || "",
    github: map.github || "",
  };
}

export default async function ContactPage() {
  const contact = await getContactSettings();
  return <ContactPageClient {...contact} />;
}
