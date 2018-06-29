import { getHeaderToken } from '../src';

test('should get token', () => {
  expect(getHeaderToken({ headers: { authorization: 'xxx' } } as any)).toBe(
    null
  );
  expect(getHeaderToken({ headers: {} } as any)).toBe(null);
  expect(
    getHeaderToken({ headers: { authorization: 'Bearer xxx' } } as any)
  ).toBe('xxx');
});
