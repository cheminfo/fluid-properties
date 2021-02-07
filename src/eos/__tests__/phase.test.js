import { getPhasefromPhi } from '../phase.js';

test('getPhasefromPhi test', () => {
  let res0 = getPhasefromPhi([0]);
  expect(res0).toStrictEqual(0);
  let res1 = getPhasefromPhi([0, 1]);
  expect(res1).toStrictEqual(0);
  let res2 = getPhasefromPhi([1, 0]);
  expect(res2).toStrictEqual(1);
});
