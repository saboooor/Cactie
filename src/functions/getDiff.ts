import Diff from 'diff';

export default function getDiff(before: string, after: string) {
  let diffArray;
  try {
    const diff = Diff.diffChars(before, after);
    diffArray = diff.map(part => { return `${part.added ? `**${part.value}**` : part.removed ? `~~${part.value}~~` : part.value}`; });
    return diffArray.join('');
  }
  catch (err) {
    logger.warn(err);
    return null;
  }
}