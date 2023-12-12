import createElement from '../../helpers/domHelper';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    // call showModal function
    const nameElement = createElement({
        tagName: 'div'
    });
    nameElement.add(fighter.name);
    showModal({ title: 'Winner', bodyElement: nameElement });
}
