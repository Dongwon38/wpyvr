import { redirect } from "next/navigation"

export const metadata = {
  title: "WPYVR Hub Posts",
  description: "Hub content now lives on the Community page.",
}

export default function HubPage() {
  redirect("/community")
}
