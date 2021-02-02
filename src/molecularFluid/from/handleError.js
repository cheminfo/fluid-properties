export function handleError(thisMol) {
  if (thisMol.length === 1) {
    return thisMol[0];
  } else if (thisMol.length === 0) {
    throw new Error('No match with database.');
  } else {
    throw new Error('Result not unique!');
  }
}
