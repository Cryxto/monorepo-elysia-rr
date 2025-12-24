export function syncTryCatchBulk(
  funcs: Array<() => any>,
  breakWhenError = false,
) {
  for (const [index, func] of funcs.entries()) {
    try {
      func();
    } catch (error) {
      console.error({ index, message: 'syncTryCatchBulk', error });
      if (breakWhenError) {
        break;
      }
    }
  }
}
