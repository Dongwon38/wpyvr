const HUB_BASE_URL =
  process.env.NEXT_PUBLIC_HUB_WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "http://localhost:8000"

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  link: string
  meta?: Record<string, any>
  _embedded?: {
    author?: { name: string }[]
    "wp:featuredmedia"?: { source_url: string }[]
  }
}

export type HubPost = {
  id: number
  slug: string
  date: string
  title: string
  excerpt: string
  content: string
  author?: string
  featuredImage?: string
  sourceSite?: string
  sourceAuthor?: string
  originUrl?: string
  likesCount: number
  commentsCount: number
  hotScore: number
}

export type HubPostOrder = "latest" | "popular" | "trending"

export type HubPostStats = {
  post_id: number
  likes_count: number
  comments_count: number
  hot_score: number
}

function buildQuery(order: HubPostOrder, perPage = 12, page = 1): URL {
  const url = new URL(`${HUB_BASE_URL}/wp-json/wp/v2/posts`)
  url.searchParams.set("status", "publish")
  url.searchParams.set("per_page", perPage.toString())
  url.searchParams.set("page", page.toString())
  url.searchParams.set("_embed", "true")

  if (order === "popular") {
    url.searchParams.set("orderby", "meta_value_num")
    url.searchParams.set("meta_key", "_hub_likes_count")
    url.searchParams.set("order", "desc")
  } else if (order === "trending") {
    url.searchParams.set("orderby", "meta_value_num")
    url.searchParams.set("meta_key", "_hub_hot_score")
    url.searchParams.set("order", "desc")
  } else {
    url.searchParams.set("orderby", "date")
    url.searchParams.set("order", "desc")
  }

  return url
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "").trim()
}

function normalizeRenderedField(field: string | { rendered: string } | undefined): string {
  if (!field) return ""
  if (typeof field === "string") return field
  return field.rendered ?? ""
}

function transformPost(data: WPPost): HubPost {
  const meta = data.meta || (data as any).meta
  const rawTitle = normalizeRenderedField(data.title)
  const rawExcerpt = normalizeRenderedField(data.excerpt)
  const rawContent = normalizeRenderedField(data.content)
  const normalizedSlug = typeof data.slug === "string" ? data.slug.trim() : ""
  const fallbackSlug = String(data.id)

  return {
    id: data.id,
    slug: normalizedSlug || fallbackSlug,
    date: data.date,
    title: stripHtml(rawTitle),
    excerpt: stripHtml(rawExcerpt),
    content: rawContent,
    author: data._embedded?.author?.[0]?.name,
    featuredImage: data._embedded?.["wp:featuredmedia"]?.[0]?.source_url || meta?.hub_featured_image_url || "",
    sourceSite: meta?.hub_source_site || "",
    sourceAuthor: meta?.hub_source_author || "",
    originUrl: data.link,
    likesCount: Number(meta?._hub_likes_count ?? meta?.hub_likes_count ?? 0),
    commentsCount: Number(meta?._hub_comments_count ?? 0),
    hotScore: Number(meta?._hub_hot_score ?? 0),
  }
}

async function safeFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || response.statusText)
  }
  return response.json()
}

function filterPushedPosts(posts: HubPost[]): HubPost[] {
  return posts.filter((post) => Boolean(post.sourceSite))
}

type FetchOptions = {
  onlyPushed?: boolean
}

export async function fetchHubPosts(
  order: HubPostOrder = "latest",
  perPage = 12,
  page = 1,
  options?: FetchOptions
): Promise<HubPost[]> {
  try {
    const url = buildQuery(order, perPage, page)
    const data: WPPost[] = await safeFetch(url.toString(), { cache: "no-store" })
    const posts = data.map(transformPost)
    return options?.onlyPushed ? filterPushedPosts(posts) : posts
  } catch (error) {
    console.error("Failed to fetch hub posts", error)
    return []
  }
}

export async function fetchHubPostBySlug(slug: string, options?: FetchOptions): Promise<HubPost | null> {
  try {
    if (!slug) {
      return null
    }

    const url = new URL(`${HUB_BASE_URL}/wp-json/wp/v2/posts`)
    url.searchParams.set("slug", slug)
    url.searchParams.set("_embed", "true")

    const data: WPPost[] = await safeFetch(url.toString(), { cache: "no-store" })
    if (!data.length) {
      return null
    }

    const post = transformPost(data[0])
    if (options?.onlyPushed && !post.sourceSite) {
      return null
    }

    return post
  } catch (error) {
    console.error("Failed to fetch hub post", error)
    return null
  }
}

export async function fetchHubPostById(id: number, options?: FetchOptions): Promise<HubPost | null> {
  try {
    if (!id) {
      return null
    }

    const data: WPPost = await safeFetch(`${HUB_BASE_URL}/wp-json/wp/v2/posts/${id}?_embed=true`, { cache: "no-store" })
    const post = transformPost(data)
    if (options?.onlyPushed && !post.sourceSite) {
      return null
    }

    return post
  } catch (error) {
    console.error("Failed to fetch hub post by ID", error)
    return null
  }
}

export async function fetchHubPost(identifier: string, options?: FetchOptions): Promise<HubPost | null> {
  const bySlug = await fetchHubPostBySlug(identifier, options)
  if (bySlug) {
    return bySlug
  }

  if (/^\d+$/.test(identifier)) {
    return fetchHubPostById(Number(identifier), options)
  }

  return null
}

async function mutateLike(method: "POST" | "DELETE", postId: number, token?: string): Promise<HubPostStats> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${HUB_BASE_URL}/wp-json/hub/v1/like`, {
    method,
    headers,
    body: JSON.stringify({ post_id: postId }),
  })

  if (!response.ok) {
    throw new Error(`Like request failed: ${response.statusText}`)
  }

  return response.json()
}

export async function likeHubPost(postId: number, token?: string): Promise<HubPostStats> {
  return mutateLike("POST", postId, token)
}

export async function unlikeHubPost(postId: number, token?: string): Promise<HubPostStats> {
  return mutateLike("DELETE", postId, token)
}

export async function fetchHubStats(postId: number): Promise<HubPostStats> {
  return safeFetch(`${HUB_BASE_URL}/wp-json/hub/v1/posts/${postId}/stats`, { cache: "no-store" })
}

export async function submitHubComment(options: {
  postId: number
  author: string
  email: string
  content: string
  token?: string
}): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`
  }

  await safeFetch(`${HUB_BASE_URL}/wp-json/wp/v2/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      post: options.postId,
      author_name: options.author,
      author_email: options.email,
      content: options.content,
      firebase_token: options.token,
    }),
  })
}
