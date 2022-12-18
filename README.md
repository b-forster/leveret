# Leveret Lunch

A leveret is a baby bunny.

This is my attempt at the [Leveret Lunch](https://fellowship.hackbrightacademy.com/materials/challenges/leveret-lunch/index.html#leveret-lunch) problem. It traverses the matrix recursively and memoizes the values and the values of its neighbors for each visited set of coordinates.

Total time spent was 12+ hours over 2 days.

## TODO
- Get `generateStartingCoords()` tests passing reliably
- Improve readability (esp. around map insertions)
- Check for possible redundant map insertions (i.e. unnecessary calls to `updateNeighborsMap()`
- Improve reusability of test variables
