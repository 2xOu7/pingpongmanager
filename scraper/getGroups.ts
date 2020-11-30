import JSSoup from "jssoup";

const isEventName = (tag: any): boolean => {
  return tag.previousElement.attrs;
};

const isEndOfEvent = (tagText: string): boolean => {
  return tagText.includes("Total Entries");
};

interface Player {
  playerName: string;
  rating: string;
}

const createDraw = (allPlayers: Player[], groupSize: number): Player[][] => {
  let totalGroups = allPlayers.length / groupSize;
  if (allPlayers.length % groupSize !== 0) {
    totalGroups += 1;
  }

  let totalProcessed = 0;
  let currentGroup = 1;
  let groups: Player[][] = [];
  let goingUpwards = true;

  while (totalProcessed < allPlayers.length) {
    if (groups.length < currentGroup) {
      groups.push([]);
    }
    let group = groups[currentGroup - 1];
    group.push(allPlayers[totalProcessed]);

    if (goingUpwards) {
      if (currentGroup === totalGroups) {
        goingUpwards = false;
      } else {
        currentGroup += 1;
      }
    } else {
      if (currentGroup === 1) {
        goingUpwards = true;
      } else {
        currentGroup -= 1;
      }
    }

    totalProcessed += 1;
  }

  return groups;
};

export default (
  rawHtml: string,
  eventName: string,
  groupSize: number
): Player[][] => {
  const soup = new JSSoup(rawHtml);
  const tags = soup.findAll("tr");
  let count = 0;
  let eventIsFound = false;

  const allPlayers: Player[] = [];

  for (const tag of tags) {
    // always ignore the first tag because it is irrelevant to the events
    if (count === 0) {
      count += 1;
      continue;
    }

    const tagText = tag.contents[0].contents[0]._text;
    if (isEventName(tag)) {
      if (tagText === eventName) {
        eventIsFound = true;
      }
    } else if (isEndOfEvent(tagText)) {
      if (eventIsFound) {
        break;
      }
    } else {
      if (eventIsFound) {
        const rating = tag.contents[1].contents[0]._text.split("/")[0].trim();
        allPlayers.push({ playerName: tagText, rating });
      }
    }
  }

  return createDraw(allPlayers, groupSize);
};
