import JSSoup from "jssoup";

const isEventName = (tag: any): boolean => {
  return tag.previousElement.attrs;
};
export default (rawHtml: string): string[] => {
  const soup = new JSSoup(rawHtml);
  const tags = soup.findAll("tr");
  let count = 0;

  const result: string[] = [];
  tags.forEach((tag) => {
    // always ignore the first tag because it is irrelevant to the events
    if (count === 0) {
      count += 1;
      return;
    }

    if (isEventName(tag)) {
      result.push(tag.contents[0].contents[0]._text);
    }
  });

  return result;
};
