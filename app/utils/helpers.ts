import type { Subscription } from '~/types'

export const isSubscribed = (listId: string, subscriptions: Subscription[]) => {
  return subscriptions.some((sub) => sub.list_id === listId)
}

export const pluralise = (count: number, word: string) => {
  return count === 1 ? word : `${word}s`
}
