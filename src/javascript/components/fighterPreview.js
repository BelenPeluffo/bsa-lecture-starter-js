import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    if (fighter) {
        const imageContainer = createElement({
            tagName: 'div',
            className: 'fighter-preview__img-container'
        });
        const imageElement = createFighterImage(fighter);
        imageContainer.appendChild(imageElement);
        const { name, ...stats } = fighter;
        const nameContainer = createElement({
            tagName: 'div',
            className: `fighter-preview__name`
        });
        const statsContainer = createElement({
            tagName: 'div',
            className: `fighter-preview__stat-container`
        });
        const nameElement = createElement({ tagName: 'div' });
        nameElement.append(name);
        Object.keys(stats).forEach(stat => {
            if (stat !== '_id' && stat !== 'source') {
                const statContainer = createElement({
                    tagName: 'div',
                    className: 'fighter-preview__stat-item-container'
                });
                [stat, stats[stat]].forEach(element => {
                    const statElement = createElement({
                        tagName: 'div'
                    });
                    statElement.append(element);
                    statContainer.appendChild(statElement);
                });
                statsContainer.appendChild(statContainer);
            }
        });
        nameContainer.appendChild(nameElement);
        // console.log('fighter?', fighter);
        fighterElement.append(imageContainer, nameContainer, statsContainer);
        // console.log('fighterElement?', fighterElement);
    }

    return fighterElement;
}
