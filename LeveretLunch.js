class LeveretLunch {
    constructor(garden) {
        this.gardenRows = garden;
        this.carrotsSum = 0;

        // memoize set of neighboring values for each set of coords
        // to avoid redundant costly lookups/updates in nested arrays
        //{ rowIndex: { colIndex: {'up': int, 'down': int, 'left': int, 'right': int, 'self': int}}}
        this.neighborsMap = {};
    }

    static COORD_OFFSETS = {
        up: [-1, 0],
        down: [1, 0],
        left: [0, -1],
        right: [0, 1]
    }

    generateStartingCoords = () => {
        const rowsMidpoint = (this.gardenRows.length - 1) / 2;
        // values below will be equal if rowsMidpoint is whole int
        let rowsMidpointLower = Math.floor(rowsMidpoint);
        let rowsMidpointHigher = Math.ceil(rowsMidpoint);

        const colsMidpoint = (this.gardenRows[0].length - 1) / 2;
        // values below will be equal if colsMidpoint is whole int
        let colsMidpointLower = Math.floor(colsMidpoint);
        let colsMidpointHigher = Math.ceil(colsMidpoint);

        // let mostCarrotsCoords = [rowsMidpointLower, colsMidpointLower];
        // let mostCarrots = this.gardenRows[rowsMidpointLower][colsMidpointLower];

        const possibleMidpoints = [
            [rowsMidpointLower, colsMidpointLower],
            [rowsMidpointLower, colsMidpointHigher],
            [rowsMidpointHigher, colsMidpointLower],
            [rowsMidpointHigher, colsMidpointHigher],
        ]

        const midpointValsMap = {};

        for (let coords of possibleMidpoints) {
            let [rowId, colId] = coords;
            let valAtCoords = this.gardenRows[rowId][colId];
            midpointValsMap[valAtCoords] = [rowId, colId];
        }

        console.log(midpointValsMap);

        const mostCarrots = Object.entries(midpointValsMap)
            .sort(([a,], [b,]) => b - a)[0]

        // console.log(mostCarrots);

        const mostCarrotsCoords = mostCarrots[1];

        // console.log(mostCarrotsCoords);

        // for (let [rowId, colId] of possibleMidpoints) {
        //     let valAtCoords = this.gardenRows[rowId][colId];
        //     if (valAtCoords > mostCarrots) {
        //         mostCarrots = valAtCoords;
        //         mostCarrotsCoords = [rowId, colId]
        //     }
        // }


        // // for (let rowId of [rowsMidpointLower, rowsMidpointHigher]) {
        // //     for (let colId of [colsMidpointLower, colsMidpointHigher]) {
        // //         let valAtCoords = this.gardenRows[rowId][colId];
        // //         console.log(`value at ${[rowId, colId]} is ${valAtCoords}`)
        // //         if (valAtCoords > mostCarrots) {
        // //             mostCarrots = valAtCoords;
        // //             mostCarrotsCoords = [rowId, colId]
        // //         }
        // //         console.log(`highest is ${mostCarrots} at ${mostCarrotsCoords}`)
        // //         console.log();
        // //     }
        // // }



        return mostCarrotsCoords;
    }

    // look up coords in neighborsMap, or in input array if doesn't yet exist in neighborsMap
    // getValAtCoordsAndMaybeUpdateMap ?
    getValAtCoords = ([rowIndex, colIndex]) => {
        let selfVal = (this.neighborsMap[rowIndex]?.[colIndex]?.['self'] ?? this.gardenRows[rowIndex]?.[colIndex]) || 0;
        this.updateNeighborsMap([rowIndex, colIndex], selfVal)
        return selfVal;
    }

    // returns neighbor values for given coords
    // getNeighborsfromMapAndMaybeUpdate ?
    // {'up': int, 'down': int, 'left': int, 'right': int, 'self': int}
    getNeighborsfromMap = ([rowIndex, colIndex]) => {
        this.neighborsMap[rowIndex] = this.neighborsMap[rowIndex] || {};
        this.neighborsMap[rowIndex][colIndex] = this.neighborsMap[rowIndex][colIndex] || {};
        let neighborVals = this.neighborsMap[rowIndex][colIndex];
        const directions = Object.keys(LeveretLunch.COORD_OFFSETS);
        for (let dir of directions) {
            if (!neighborVals[dir]) {
                let coordsForDir = this.getCoordsForDirection([rowIndex, colIndex], dir);
                let valAtDir = this.getValAtCoords(coordsForDir)
                this.updateNeighborsMap(coordsForDir, valAtDir)
                neighborVals[dir] = valAtDir;
            }
        }
        return neighborVals;
    }

    updateNeighborsMap = ([rowIndex, colIndex], newVal) => {
        this.neighborsMap[rowIndex] = this.neighborsMap[rowIndex] || {};
        this.neighborsMap[rowIndex][colIndex] = this.neighborsMap[rowIndex][colIndex] || {};

        this.neighborsMap[rowIndex][colIndex]['self'] = newVal;

        for (let [direction, offsets] of Object.entries(LeveretLunch.COORD_OFFSETS)) {
            let [rowOffset, colOffset] = offsets;

            this.neighborsMap[rowIndex - rowOffset] = this.neighborsMap[rowIndex - rowOffset] || {};
            this.neighborsMap[rowIndex - rowOffset][colIndex - colOffset] = this.neighborsMap[rowIndex - rowOffset][colIndex - colOffset] || {};
            this.neighborsMap[rowIndex - rowOffset][colIndex - colOffset][direction] = newVal;
        };
        return this.neighborsMap;
    }

    // returns direction (up/down/left/right) of neighbor with highest carrot count
    findJuciestDirection = (neighborVals) => {
        let juciest =
            Object.entries(neighborVals)
                .sort(([, a], [, b]) => b - a)[0] // [direction, val]
        let juciestDirection = juciest[0];
        return juciestDirection;
    }

    getCoordsForDirection = ([originRowId, originColId], direction) => {
        let offsets = LeveretLunch.COORD_OFFSETS[direction];
        let [rowOffset, colOffset] = offsets;
        let neighborCoords = [(originRowId + rowOffset), (originColId + colOffset)];
        return neighborCoords;
    }

    eatCarrots = ([rowIndex, colIndex]) => {
        let numOfCarrots = this.getValAtCoords([rowIndex, colIndex]);
        console.log(`There are ${numOfCarrots} carrots at ${[rowIndex, colIndex]}.`)
        this.updateNeighborsMap([rowIndex, colIndex], 0);

        return numOfCarrots;
    }

    run = () => {
        // return 0 carrots if input is empty [] or [[]]
        const rowsCount = this.gardenRows.length;
        const colsCount = this.gardenRows[0].length;
        if (!rowsCount || !colsCount) {
            console.log('There are no carrots to eat! :(')
            return 0;
        }


        // let [rowIndex, colIndex] = this.generateStartingCoords();
        // hardcoding for now until generateStartingCoords() tests are passing reliably
        let [rowIndex, colIndex] = [3, 3];
        console.log(`Starting at ${rowIndex, colIndex}`)
        console.log();

        // recursive function:
        //  add value at current coords to carrotSum
        //  update 'self' value to 0 for current coords in neighborsMap
        //  update appropriate neighbor value to 0 at neighboring coords in neighborsMap
        //      (e.g. update 'up' count to 0 for the coords below)
        //  find neighbor with highest carrot count
        //      base case: return carrotCount if highest neighboring count is 0
        //  make those the new coords for next iteration
        const eatAndGo = ([rowIndex, colIndex]) => {
            this.carrotsSum += this.eatCarrots([rowIndex, colIndex]);
            console.log(`The total carrots so far is ${this.carrotsSum}.`)

            let neighborVals = this.getNeighborsfromMap([rowIndex, colIndex]);
            console.log(neighborVals)

            let nextDirection = this.findJuciestDirection(neighborVals);
            console.log(`Going ${nextDirection}.`);
            console.log();

            if (neighborVals[nextDirection] <= 0) {
                console.log(`The leveret ate ${this.carrotsSum} carrots. Good night!`);
                console.log();
                return this.carrotsSum;
            }
            let nextCoords = this.getCoordsForDirection([rowIndex, colIndex], nextDirection)

            return eatAndGo(nextCoords);
        }
        return eatAndGo([rowIndex, colIndex]);
    }
}

module.exports = LeveretLunch;

let garden = [
    [2, 3, 1, 4, 2, 2, 3],
    [2, 3, 0, 4, 0, 3, 0],
    [1, 7, 0, 2, 1, 2, 3],
    [9, 3, 0, 4, 2, 0, 3],
];

let leveretLunch = new LeveretLunch(garden);
leveretLunch.run();
