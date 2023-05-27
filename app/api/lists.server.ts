import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { profanity } from '@2toad/profanity'
import z from 'zod'

import createServerSupabase from '~/utils/supabase.server'

const listSchema = z.object({
  name: z.string().min(1, { message: 'List requires a name' }),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private']),
})

const getListValues = (formData: FormData) => {
  const name = formData.get('name')
  const visibility = formData.get('visibility')
  const description = formData.get('description')
  const tags = formData.get('tags') as string
  const tagIds = tags ? tags.split(',') : []

  return {
    name,
    visibility,
    description,
    tagIds,
  }
}

export const createList = async (request: Request) => {
  const response = new Response()

  const formData = await request.formData()
  const { name, visibility, description, tagIds } = getListValues(formData)

  const schemaResult = listSchema.safeParse({
    name,
    description,
    visibility,
  })

  if (!schemaResult.success) {
    const flatErrors = schemaResult.error.flatten()
    return json({ errors: flatErrors.fieldErrors, schemaResult })
  }

  if (profanity.exists(schemaResult.data.name)) {
    return json({
      profanityErrors: { name: 'List name contains profanity' },
    })
  }

  const supabase = createServerSupabase({ request, response })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  invariant(user, 'You must be signed in to perform this action.')

  const { data, error } = await supabase
    .from('lists')
    .insert({
      name: schemaResult.data.name,
      visibility: schemaResult.data.visibility,
      description: schemaResult.data.description,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const tagData = tagIds.map((tagId) => ({
    id: `${tagId}-${data.id}`,
    tag_id: tagId,
    list_id: data.id,
  }))

  const { error: tagsError } = await supabase.from('lists_tags').insert(tagData)

  if (tagsError) console.error(tagsError)

  return redirect(`/lists/${data.id}`)
}

export const updateList = async (request: Request, listId: string) => {
  const response = new Response()

  const formData = await request.formData()
  const { name, visibility, description, tagIds } = getListValues(formData)

  const schemaResult = listSchema.safeParse({
    name,
    description,
    visibility,
  })

  if (!schemaResult.success) {
    const flatErrors = schemaResult.error.flatten()
    return json({ errors: flatErrors.fieldErrors, schemaResult })
  }

  if (profanity.exists(schemaResult.data.name)) {
    return json({
      profanityErrors: { name: 'List name contains profanity' },
    })
  }

  const supabase = createServerSupabase({ request, response })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  invariant(user, 'You must be signed in to perform this action.')

  const { error } = await supabase
    .from('lists')
    .update({
      name: schemaResult.data.name,
      visibility: schemaResult.data.visibility,
      description: schemaResult.data.description,
      user_id: user.id,
    })
    .eq('id', listId)

  if (error) {
    throw new Error(error.message)
  }

  const tagData = tagIds.map((tagId) => ({
    id: `${tagId}-${listId}`,
    tag_id: tagId,
    list_id: listId,
  }))

  const { error: tagsError } = await supabase.from('lists_tags').upsert(tagData)

  if (tagsError) console.error(tagsError)

  return redirect(`/lists/${listId}`)
}

export const deleteList = async (request: Request, listId: string) => {
  const response = new Response()
  const supabase = createServerSupabase({ request, response })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  invariant(user, 'You must be signed in to perform this action.')

  const { error } = await supabase.from('lists').delete().eq('id', listId)

  if (error) {
    throw new Error(error.message)
  }

  return redirect(`/lists`)
}
