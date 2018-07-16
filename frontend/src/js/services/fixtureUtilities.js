
function getLevel(battleId, numberOfBattlesZero) {
    let level =1, lf = false, roof = numberOfBattlesZero;
    while(!lf){
        if (battleId <= roof){
            lf = true;
        } else {
            level++;
            roof +=  Math.floor(numberOfBattlesZero/level);
        }
    }
    return level;
}

function getLevelsRange(numberOfParticipants) {
    let maxLevel = getLevel(numberOfParticipants - 1, numberOfParticipants / 2),
        list = [];
    for (let i = 1; i <= maxLevel; i++) {
        list.push(i);
    }
    const levelNames = ["32 avos","16 avos","octavos","cuartos","semis","final"];
    let levelsResponse = [];
    for (let j = maxLevel, i = levelNames.length - 1; j >= 1; j --, i --){
        levelsResponse[j] = levelNames[i];
    }
    return levelsResponse;
}

module.exports = {
    getLevel: getLevel,
    getLevelsRange: getLevelsRange
};
