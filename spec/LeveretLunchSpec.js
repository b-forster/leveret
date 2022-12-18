const LeveretLunch = require('../LeveretLunch');

describe("LeveretLunch", function () {
    const garden = [
        [2, 3, 1, 4, 2, 2, 3],
        [2, 3, 0, 4, 0, 3, 0],
        [1, 7, 0, 2, 1, 2, 3],
        [9, 3, 0, 4, 2, 0, 3],
    ];

    beforeEach(() => {
        leveretLunch = new LeveretLunch(garden);
    });

    fdescribe("generateStartingCoords", () => {
        describe("for garden with odd rows, odd columns", () => {
            beforeEach(() => {
                const oddOddGarden = garden.slice(0, 3)
                oddOddLeveretLunch = new LeveretLunch(oddOddGarden);
                // [
                //     [2, 3, 1, 4, 2, 2, 3],
                //     [2, 3, 0, 4, 0, 3, 0],
                //     [1, 7, 0, 2, 1, 2, 3],
                // ];
            });
            it("returns midpoint coords", () => {
                expect(oddOddLeveretLunch.generateStartingCoords()).toEqual([1, 3]);
            })
        })

        xdescribe("for garden with odd rows, even columns", () => {
            beforeEach(() => {
                const oddEvenGarden = garden.slice(0, 3);
                for (let row of oddEvenGarden) {
                    row.push(0);
                }
                oddEvenLeveretLunch = new LeveretLunch(oddEvenGarden);
                // [
                //     [2, 3, 1, 4, 2, 2, 3, 0],
                //     [2, 3, 0, 4, 0, 3, 0, 0],
                //     [1, 7, 0, 2, 1, 2, 3, 0],
                // ];
            });
            it("returns midpoint coords with highest value", () => {
                expect(oddEvenLeveretLunch.generateStartingCoords()).toEqual([1, 3]);
            })
        })

        xdescribe("for garden with even rows, odd columns", () => {
            beforeEach(() => {
                const evenOddGarden = garden;
                evenOddLeveretLunch = new LeveretLunch(evenOddGarden);
                //     [
                //         [2, 3, 1, 4, 2, 2, 3],
                //         [2, 3, 0, 4, 0, 3, 0],
                //         [1, 7, 0, 2, 1, 2, 3],
                //         [9, 3, 0, 4, 2, 0, 3],
                //     ];
            });
            it("returns midpoint coords with highest value", () => {
                expect(evenOddLeveretLunch.generateStartingCoords()).toEqual([1, 3]);
            })
        })
        xdescribe("for garden with even rows, even columns", () => {
            beforeEach(() => {
                const evenEvenGarden = garden;
                for (let row of evenEvenGarden) {
                    row.push(0);
                }
                evenEvenLeveretLunch = new LeveretLunch(evenEvenGarden);
                // [
                //     [2, 3, 1, 4, 2, 2, 3, 0],
                //     [2, 3, 0, 4, 0, 3, 0, 0],
                //     [1, 7, 0, 2, 1, 2, 3, 0],
                //     [9, 3, 0, 4, 2, 0, 3, 0],
                // ];
            });
            it("returns midpoint coords with highest value", () => {
                expect(evenEvenLeveretLunch.generateStartingCoords()).toEqual([1, 3]);
            })
        })
    })

    describe("getValAtCoords", () => {
        it("returns value at given coords from array", () => {
            expect(leveretLunch.getValAtCoords([0, 0])).toBe(2);
            expect(leveretLunch.getValAtCoords([1, 3])).toBe(4);
            expect(leveretLunch.getValAtCoords([3, 5])).toBe(0);
            expect(leveretLunch.getValAtCoords([2, 6])).toBe(3);
        });

        describe("coords are out of bounds", () => {
            it("returns 0", () => {
                expect(leveretLunch.getValAtCoords([-1, 2])).toBe(0);
                expect(leveretLunch.getValAtCoords([1, -2])).toBe(0);
                expect(leveretLunch.getValAtCoords([8, 5])).toBe(0);
                expect(leveretLunch.getValAtCoords([6, 7])).toBe(0);
            });
        })
    })

    describe("getNeighborsfromMap", () => {
        describe("if neighborsMap is empty", () => {
            it("populates neighbors for given coords", () => {
                expect(leveretLunch.getNeighborsfromMap([0, 0])).toEqual({
                    up: 0,
                    down: 2,
                    left: 0,
                    right: 3,
                });
            });
        })

        describe("if rowIndex exists in neighborsMap but colIndex is empty", () => {
            beforeEach(() => {
                leveretLunch.neighborsMap = {
                    0: {
                        2: { right: 1 },
                    }
                }
            });

            it("populates neighbors for given coords", () => {
                expect(leveretLunch.getNeighborsfromMap([0, 0])).toEqual({
                    up: 0,
                    down: 2,
                    left: 0,
                    right: 3,
                });
                expect(leveretLunch.getNeighborsfromMap([0, 1])).toEqual({
                    up: 0,
                    down: 3,
                    left: 2,
                    right: 1,
                    self: 3,
                });
                expect(leveretLunch.getNeighborsfromMap([0, 2])).toEqual({
                    up: 0,
                    down: 0,
                    left: 3,
                    right: 1,
                    self: 1,
                });
            });
        })

        describe("if rowIndex and colIndex exist", () => {
            beforeEach(() => {
                leveretLunch.neighborsMap = {
                    0: {
                        1: { right: 1 },
                        2: { down: 0, left: 3, right: 4 },
                    }
                }
            });

            it("returns all cached neighboring value for coords", () => {
                expect(leveretLunch.getNeighborsfromMap([0, 1])).toEqual({
                    up: 0,
                    down: 3,
                    left: 2,
                    right: 1,
                });
                expect(leveretLunch.getNeighborsfromMap([0, 2])).toEqual({
                    up: 0,
                    down: 0,
                    left: 3,
                    right: 4,
                });
            });
        })
    });

    describe("updateNeighborsMap", () => {
        describe("if neighborsMap is empty", () => {
            it("adds rowIndex, colIndex, and new neighboring values", () => {
                expect(leveretLunch.updateNeighborsMap([3, 3], 10)).toEqual(
                    {
                        2: {
                            3: { down: 10 }, // down val from [2,3] = 10
                        },
                        3: {
                            2: { right: 10 }, // right val from [3,2] = 10
                            3: { self: 10 },
                            4: { left: 10 }, // left val from [3,4] = 10
                        }, 4: {
                            3: { up: 10 } // up val from [4,3] = 10
                        }
                    }
                );
            });
        })

        describe("if rowIndex exists in neighborsMap but colIndex is empty", () => {
            beforeEach(() => {
                leveretLunch.neighborsMap = {
                    3: {
                        2: { right: 0 },
                    }
                }
            });
            it("adds colIndex, and new neighboring value", () => {
                expect(leveretLunch.updateNeighborsMap([3, 3], 10)).toEqual(
                    {
                        2: {
                            3: { down: 10 }, // down val of [2,3] = 10
                        },
                        3: {
                            2: { right: 10 }, // right val of [3,2] = 10
                            3: { self: 10 },
                            4: { left: 10 }, // left val of [3,4] = 10
                        }, 4: {
                            3: { up: 10 } // up val of [4,3] = 10
                        }
                    }
                );
            });
        })

        describe("if rowIndex and colIndex exist", () => {
            beforeEach(() => {
                leveretLunch.neighborsMap = {
                    3: {
                        3: { up: 4 },
                        4: { left: 4, right: 0 }
                    }
                }
            });
            it("updates neighboring value", () => {
                expect(leveretLunch.updateNeighborsMap([3, 3], 10)).toEqual(
                    {
                        2: {
                            3: { down: 10 }, // down val of [2,3] = 10
                        },
                        3: {
                            2: { right: 10 }, // right val of [3,2] = 10
                            3: { up: 4, self: 10 },
                            4: { left: 10, right: 0 }, // left val of [3,4] = 10
                        }, 4: {
                            3: { up: 10 } // up val of [4,3] = 10
                        }
                    }
                );
            });
        });
    });

    describe("findJuciestDirection", () => {
        describe("if all directions exist in neighborsMap", () => {
            beforeEach(() => {
                neighborVals = { up: 1, down: 2, left: 3, right: 4, }
            });
            it("returns neighbor with the highest number of carrots", () => {
                expect(leveretLunch.findJuciestDirection(neighborVals)).toEqual('right')
            })
        })
        describe("if some directions exist in neighborsMap", () => {
            beforeEach(() => {
                neighborVals = { left: 3, down: 2 }
            });
            it("returns neighbor with the highest number of carrots", () => {
                expect(leveretLunch.findJuciestDirection(neighborVals)).toEqual('left')
            })
        })
        describe("if highest value is 0", () => {
            beforeEach(() => {
                neighborVals = { up: 0 }
            });
            it("returns neighbor with the highest number of carrots", () => {
                expect(leveretLunch.findJuciestDirection(neighborVals)).toEqual('up')
            })
        })
    })

    describe("getCoordsForDirection", () => {
        it("returns coordinates for neighbor in given direction from origin coords", () => {
            expect(leveretLunch.getCoordsForDirection([3, 3], 'up')).toEqual([2, 3])
            expect(leveretLunch.getCoordsForDirection([3, 3], 'down')).toEqual([4, 3])
            expect(leveretLunch.getCoordsForDirection([3, 3], 'left')).toEqual([3, 2])
            expect(leveretLunch.getCoordsForDirection([3, 3], 'right')).toEqual([3, 4])
            expect(leveretLunch.getCoordsForDirection([0, 0], 'left')).toEqual([0, -1])
            expect(leveretLunch.getCoordsForDirection([0, 0], 'up')).toEqual([-1, 0])
            expect(leveretLunch.getCoordsForDirection([6, 6], 'right')).toEqual([6, 7])
            expect(leveretLunch.getCoordsForDirection([6, 6], 'down')).toEqual([7, 6])
        })
    })

    describe("eatCarrots", () => {
        it("returns number of carrots at current coordinates", () => {
            expect(leveretLunch.eatCarrots([3, 3])).toBe(garden[3][3])
        })
        it("updates value to 0 in neighbor references", () => {
            leveretLunch.eatCarrots([3, 3]);
            let map = leveretLunch.neighborsMap;
            expect(map[2][3]['down']).toBe(0);
            expect(map[4][3]['up']).toBe(0);
            expect(map[3][2]['right']).toBe(0);
            expect(map[3][4]['left']).toBe(0);
        })
    })
});