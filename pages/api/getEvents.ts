import { NextApiRequest, NextApiResponse } from 'next'
import getEvents from '../../scraper/getEvents'
import joi from 'joi'

const getEventsPayloadSchema = joi.object({
  tournamentUrl: joi.string().required(),
})

interface GetEventsResponsePayload {
  events: string[]
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GetEventsResponsePayload>
) => {
  const { method, body } = req

  if (method !== 'POST') {
    return res.status(404).json({ events: [] })
  }

  const { value, error } = getEventsPayloadSchema.validate(body)

  if (error) {
    return res.status(400).json({ events: [] })
  }
  const { tournamentUrl } = value
  const response = await fetch(tournamentUrl)
  const rawHtml = await response.text()

  res.status(200).json({ events: getEvents(rawHtml) })
}
