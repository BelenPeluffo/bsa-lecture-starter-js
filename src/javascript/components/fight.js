/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import controls from '../../constants/controls';

const pressedControls = {};
Object.keys(controls).forEach(key => {
    pressedControls[key] = false;
});
// console.log('pressedControls?', pressedControls);

export async function fight(firstFighter, secondFighter) {
    let playerOneHealth = firstFighter.health;
    let playerTwoHealth = secondFighter.health;
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        if (playerTwoHealth >= 1 && playerOneHealth >= 1) {
            document.addEventListener('keydown', event => {
                const control = Object.keys(controls).find(key => controls[key] === event.code);
                pressedControls[control] = true;
                const isPlayerOne = /One/.test(control);
                const isDefender = /Block/.test(control);
                // console.log('pressedControls?', pressedControls);
                let damage = 0;
                if (!isDefender) {
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
                pressedControls[control] = false;
                console.log('pressedControls?', pressedControls);
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
    const critialHitChance = Math.floor(Math.random() * 2) + 1;
    const hitPower = fighter.attack * critialHitChance;
    const criticalStrike = fighter.attack * 2;
    // console.log('hitPower?', hitPower);
    return hitPower;
}

export function getBlockPower(fighter) {
    // return block power
    const dodgeChance = Math.floor(Math.random() * 2) + 1;
    const power = fighter.defense * dodgeChance;
    // console.log('power?', power);
    return power;
}

export function getDamage(attacker, defender) {
    // return damage
    // console.log(getHitPower(attacker) - getBlockPower(defender));
    const { PlayerOneBlock, PlayerTwoBlock } = pressedControls;
    const isBlocking = PlayerOneBlock || PlayerTwoBlock;
    // const damage = isBlocking ? getHitPower(attacker) - getBlockPower(defender) : getHitPower(attacker);
    const damage = getHitPower(attacker) - (isBlocking ? getBlockPower(defender) : 0);
    return damage > 0 ? damage : 0;
}
