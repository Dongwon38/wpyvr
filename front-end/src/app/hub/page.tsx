import { redirect } from "next/navigation"

export const metadata = {
  title: "WPYVR Hub Posts",
  description: "허브 콘텐츠는 이제 Community 페이지에서 확인할 수 있습니다.",
}

export default function HubPage() {
  redirect("/community")
}
