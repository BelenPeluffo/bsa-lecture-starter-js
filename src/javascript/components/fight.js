/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import controls from '../../constants/controls';
import { createReferenceObject } from '../helpers/fightHelper';

const pressedControls = createReferenceObject(Object.keys(controls));
const criticalCombinations = createReferenceObject([
    ...controls.PlayerOneCriticalHitCombination,
    ...controls.PlayerTwoCriticalHitCombination
]);
// console.log('pressedControls?', pressedControls);

export async function fight(firstFighter, secondFighter) {
    let { PlayerOneCriticalHitCombination, PlayerTwoCriticalHitCombination } = pressedControls;
    let playerOneHealth = firstFighter.health;
    let playerTwoHealth = secondFighter.health;
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        if (playerTwoHealth >= 1 && playerOneHealth >= 1) {
            document.addEventListener('keydown', event => {
                const isCriticalCombo = Object.keys(criticalCombinations).find(key => key === event.code);
                const control = Object.keys(controls).find(key => controls[key] === event.code);
                pressedControls[control] = !isCriticalCombo && control;
                criticalCombinations[isCriticalCombo] = !!isCriticalCombo;
                const isPlayerOne = /One/.test(control);
                const isDefender = /Block/.test(control);
                const playerOneCriticalHit = controls.PlayerOneCriticalHitCombination.every(
                    combo => criticalCombinations[combo] === true
                );
                const playerTwoCriticalHit = controls.PlayerTwoCriticalHitCombination.every(
                    combo => criticalCombinations[combo] === true
                );
                PlayerOneCriticalHitCombination = playerOneCriticalHit;
                PlayerTwoCriticalHitCombination = playerTwoCriticalHit;
                let damage = 0;
                if (!isDefender && (control || PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination)) {
                    damage = getDamage.apply(
                        this,
                        isPlayerOne ? [firstFighter, secondFighter] : [secondFighter, firstFighter]
                    );
                    console.log('damage?', damage);
                    playerTwoHealth -= isPlayerOne ? damage : 0;
                    playerOneHealth -= !isPlayerOne ? damage : 0;
                    damage = 0;
                    console.log('playerTwoHealth?', playerTwoHealth);
                    console.log('playerOneHealth?', playerOneHealth);
                }
            });
            document.addEventListener('keyup', event => {
                const control = Object.keys(controls).find(key => controls[key] === event.code);
                const isCriticalCombo = Object.keys(criticalCombinations).find(key => key === event.code);
                pressedControls[control] = false;
                criticalCombinations[isCriticalCombo] = false;
            });
        } else {
            // Cuando la promesa se resuelva, devolverá el objeto del fighter ganador:
            // De cómo mostrar el ganador se encarga el elemento que haya llamado a esta función.

            resolve(playerOneHealth > 0 ? firstFighter : secondFighter);
        }
    });
}

export function getHitPower(fighter) {
    // return hit power
    const { PlayerOneCriticalHitCombination, PlayerTwoCriticalHitCombination } = pressedControls;
    const critialHitChance = Math.floor(Math.random() * 2) + 1;
    const hitPower = fighter.attack * critialHitChance;
    const criticalStrike = fighter.attack * 2;
    return PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination ? criticalStrike : hitPower;
}

export function getBlockPower(fighter) {
    // return block power
    const { PlayerOneCriticalHitCombination, PlayerTwoCriticalHitCombination } = pressedControls;
    const dodgeChance = Math.floor(Math.random() * 2) + 1;
    const power = fighter.defense * dodgeChance;
    return PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination ? 0 : power;
}

export function getDamage(attacker, defender) {
    // return damage
    // console.log('state of pressedControls', pressedControls);
    const { PlayerOneBlock, PlayerTwoBlock } = pressedControls;
    const isBlocking = PlayerOneBlock || PlayerTwoBlock;
    const damage = getHitPower(attacker) - (isBlocking ? getBlockPower(defender) : 0);
    return damage > 0 ? damage : 0;
}
