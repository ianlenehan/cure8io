import type { Database } from 'db_types'

export type Curation = {
  comment: string
  curatorId: string
  curatorName: string
  date: FirebaseFirestore.Timestamp
  id: string
  linkId: string
  opened?: boolean
  rating?: string
  selfSave?: boolean
  status: string
  url: string
  userEmail: string
  userName: string
}

export type CuratedLink = Database['public']['Tables']['curated_links']['Row']

export type Link = Database['public']['Tables']['links']['Row']

export type List = Database['public']['Tables']['lists']['Row']

export type ListTag = Database['public']['Tables']['tags']['Row']

export type Batch = Database['public']['Tables']['batches']['Row']

export type Post = Database['public']['Tables']['posts']['Row']

export type Subscription = Database['public']['Tables']['subscriptions']['Row']

export type Interaction = Database['public']['Tables']['interactions']['Row']

export type Issue = Database['public']['Tables']['issues']['Row']

export type Newsletter = Database['public']['Tables']['newsletters']['Row']

export type ListErrors = {
  name?: string[] | undefined
  description?: string[] | undefined
  visibility?: string[] | undefined
}
