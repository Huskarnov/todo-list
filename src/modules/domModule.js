import { projects } from './dataModule';

export {renderCards, giveEvents};


const cardGrid = document.querySelector('.card-grid');



const createCard = function(project){
    let card = document.createElement('div');
    card.classList.add('card');

    let title = document.createElement('h3');
    let description = document.createElement('p');
    let dueDate = document.createElement('p');

    title.textContent = project.title;
    description.textContent = project.description;
    dueDate.textContent = project.dueDate;

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(dueDate);

    return card;
};


//uses create card for every project data to generate a card
const renderCards = function(){
    for(let i = 0; i <= projects.length - 1; i++){
        cardGrid.appendChild(createCard(projects[i]));
    }
}

//gives event listeners to elements
function giveEvents(){
    //new project event
    const newProject = document.querySelector('header svg');
    const dialog = document.querySelector('dialog');

        newProject.addEventListener('click', ()=>{
        dialog.showModal();
    });
    
    //submit button
    const submitButton = document.querySelector('#new-project-submit');
    submitButton.addEventListener('click', (e)=>{
        e.preventDefault();
        dialog.close();
    });

    const cancelButton = document.querySelector('#new-project-cancel');
    cancelButton.addEventListener('click', (e)=>{
        e.preventDefault();
        dialog.close();
    });

};
