// import controls from '../../constants/controls';
// import showWinnerModal from './modal/winner';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        // const winner = firstFighter.health === 0 ? firstFighter : secondFighter;
        // showWinnerModal(winner);
        Promise.resolve(resolve);
        Promise.resolve(firstFighter);
        Promise.resolve(secondFighter);
    });
}

export function getHitPower(fighter) {
    // return hit power
    const critialHitChance = Math.floor(Math.random() * 2) + 1;
    const hitPower = fighter.attack * critialHitChance;
    return hitPower;
}

export function getBlockPower(fighter) {
    // return block power
    const dodgeChance = Math.floor(Math.random() * 2) + 1;
    const power = fighter.defense * dodgeChance;
    return power;
}

export function getDamage(attacker, defender) {
    // return damage
    return getHitPower(attacker) - getBlockPower(defender);
}
