const assert = require('assert');

function nextBattleCalculator(battleId, numberOfParticipants) {


    function getLevel(battleId, numberOfParticipants) {
        let level =1, lf = false, roof = numberOfParticipants;
        while(!lf){
            if (battleId <= roof){
                lf = true;
            } else {
                level++;
                roof +=  Math.floor(numberOfParticipants/level);
            }
        }
        return level;
    }

    function levelStartingIndex(level, numberOfParticipants) {
        if (level === 0)
            return 1;
        let floor = 0;
        for (let j = 1; j < level; j *= 2){
            floor += Math.floor(numberOfParticipants/level);
        }
        return floor + 1;
    }
    let currentBattleLevel = getLevel(battleId, numberOfParticipants),
        currentLevelIndex = levelStartingIndex(currentBattleLevel, numberOfParticipants),
        parentStartingIndex = levelStartingIndex(currentBattleLevel + 1, numberOfParticipants),
        parentLevelOffset = Math.floor( (battleId - currentLevelIndex) / 2);
    let nextBattleIndex = parentStartingIndex + parentLevelOffset;
    return nextBattleIndex;
}

module.exports = nextBattleCalculator;