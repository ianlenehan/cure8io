export type RawLink = {
  title: string
  description: string
  url: string
}

export type Link = RawLink & {
  newsletter_id: string
  issue_id?: string
}
