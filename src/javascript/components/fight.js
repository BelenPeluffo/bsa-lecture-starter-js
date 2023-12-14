/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import controls from '../../constants/controls';
import { createReferenceObject, setControlState, updateHealthBar } from '../helpers/fightHelper';

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

        const keyDownListener = event => {
            console.log('keyDownListener');
            // console.log('event.code?', event.code);
            // console.log('pressedControls?', pressedControls);
            const isRegularControl = Object.keys(controls).find(key => controls[key] === event.code);
            const isComboControl = Object.keys(criticalCombinations).includes(event.code);
            // console.log('isComboControl?', isComboControl);
            if (isRegularControl || isComboControl) {
                let secondsCounter = 0;
                if (isRegularControl) setControlState(controls, true, pressedControls, 'key', event.code);
                else if (!isRegularControl && isComboControl) {
                    console.log('secondsCounter?', secondsCounter);
                    setControlState(criticalCombinations, true, null, 'value', event.code);
                    if (secondsCounter === 0) {
                        // console.log('isComboControl!');
                        PlayerOneCriticalHitCombination = setControlState(
                            controls.PlayerOneCriticalHitCombination,
                            true,
                            criticalCombinations
                        );
                        PlayerTwoCriticalHitCombination = setControlState(
                            controls.PlayerTwoCriticalHitCombination,
                            true,
                            criticalCombinations
                        );
                        if (PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination) {
                            console.log('Intervalo!');
                            secondsCounter += 1;
                            setInterval(() => {
                                secondsCounter += 1;
                            }, 1000);
                        } else if (secondsCounter > 10) {
                            secondsCounter = 0;
                        }
                    }
                }

                const isPlayerOne = /One/.test(isRegularControl) || PlayerOneCriticalHitCombination;
                const isDefender = /Block/.test(isRegularControl);
                // console.log('criticalCombinations?', criticalCombinations);
                let damage = 0;
                if (
                    !isDefender &&
                    (isRegularControl || PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination)
                ) {
                    damage = getDamage.apply(
                        this,
                        isPlayerOne ? [firstFighter, secondFighter] : [secondFighter, firstFighter]
                    );
                    // console.log('isPlayerOne?', isPlayerOne);
                    // console.log('PlayerOneCriticalHitCombination?', PlayerOneCriticalHitCombination);
                    // console.log('PlayerTwoCriticalHitCombination?', PlayerTwoCriticalHitCombination);
                    console.log('damage?', damage);
                    if (isPlayerOne) {
                        playerTwoHealth -= isPlayerOne ? damage : 0;
                        updateHealthBar('right', secondFighter.health, playerTwoHealth);
                    } else {
                        playerOneHealth -= !isPlayerOne || PlayerTwoCriticalHitCombination ? damage : 0;
                        updateHealthBar('left', firstFighter.health, playerOneHealth);
                    }
                    damage = 0;
                    if (playerTwoHealth < 1 || playerOneHealth < 1) {
                        // Resolve the promise with the winner when the fight is over
                        console.log('Game over');
                        document.removeEventListener('keydown', keyDownListener);
                        document.removeEventListener('keyup', keyUpListener);
                        resolve(playerOneHealth > 0 ? firstFighter : secondFighter);
                    }
                    console.log('playerTwoHealth?', playerTwoHealth);
                    console.log('playerOneHealth?', playerOneHealth);
                }
            }
        };

        const keyUpListener = event => {
            console.log('============KEY-UP==============');
            setControlState(controls, false, pressedControls, 'key', event.code);
            setControlState(criticalCombinations, false, null, 'value', event.code);
            // PlayerOneCriticalHitCombination = setControlState(
            //     controls.PlayerOneCriticalHitCombination,
            //     false,
            //     criticalCombinations
            // );
            // PlayerTwoCriticalHitCombination = setControlState(
            //     controls.PlayerTwoCriticalHitCombination,
            //     false,
            //     criticalCombinations
            // );
        };

        document.addEventListener('keydown', keyDownListener);
        document.addEventListener('keyup', keyUpListener);
    });
}

export function getHitPower(fighter) {
    // return hit power
    const { PlayerOneCriticalHitCombination, PlayerTwoCriticalHitCombination } = pressedControls;
    const critialHitChance = Math.floor(Math.random() * 2) + 1;
    const hitPower = fighter.attack * critialHitChance;
    const criticalStrike = fighter.attack * 2;
    // console.log(
    //     'hitPower?',
    //     PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination ? criticalStrike : hitPower
    // );
    return PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination ? criticalStrike : hitPower;
}

export function getBlockPower(fighter) {
    // return block power
    const { PlayerOneCriticalHitCombination, PlayerTwoCriticalHitCombination } = pressedControls;
    // console.log('PlayerOneCriticalHitCombination?', PlayerOneCriticalHitCombination);
    // console.log('PlayerTwoCriticalHitCombination?', PlayerTwoCriticalHitCombination);
    const dodgeChance = Math.floor(Math.random() * 2) + 1;
    const power = fighter.defense * dodgeChance;
    // console.log('blockPower?', PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination ? 0 : power);
    return PlayerOneCriticalHitCombination || PlayerTwoCriticalHitCombination ? 0 : power;
}

export function getDamage(attacker, defender) {
    // return damage
    // console.log('state of pressedControls', pressedControls);
    const { PlayerOneBlock, PlayerTwoBlock } = pressedControls;
    const isBlocking = PlayerOneBlock || PlayerTwoBlock;
    // console.log('isBlocking?', isBlocking);
    const damage = getHitPower(attacker) - (isBlocking ? getBlockPower(defender) : 0);
    return damage > 0 ? damage : 0;
}
