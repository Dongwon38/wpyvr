import { redirect } from "next/navigation"

type Props = {
  params: { slug: string }
}

export default function HubPostRedirect({ params }: Props) {
  redirect(`/community/${params.slug}`)
}
