import { NextApiRequest, NextApiResponse } from "next";
import getGroups from "../../scraper/getGroups";
import joi from "joi";

const getGroupsPayloadSchema = joi.object({
  tournamentUrl: joi.string().required(),
  eventName: joi.string().required(),
  groupSize: joi.number().required(),
});

interface Player {
  playerName: string;
  rating: string;
}

interface GetGroupsResponsePayload {
  groups: Player[][];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GetGroupsResponsePayload>
) => {
  const { method, body } = req;

  if (method !== "POST") {
    return res.status(404).json({ groups: [] });
  }

  const { value, error } = getGroupsPayloadSchema.validate(body);

  if (error) {
    console.log(error);
    return res.status(400).json({ groups: [] });
  }

  const { tournamentUrl, eventName, groupSize } = value;
  const response = await fetch(tournamentUrl);
  const rawHtml = await response.text();

  res.status(200).json({ groups: getGroups(rawHtml, eventName, groupSize) });
};
