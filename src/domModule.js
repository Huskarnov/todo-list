export {renderCards};

const cardGrid = document.querySelector('.card-grid');
const newProject = document.querySelector('header svg');
const dialog = document.querySelector('dialog');

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



const renderCards = function(projects){
    for(let i = 0; i <= projects.length; i++){
        cardGrid.appendChild(createCard(projects[i]));
    }
}

newProject.addEventListener('click', ()=>{
    dialog.showModal();
});