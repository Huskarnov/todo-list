
export {projects, dataManagement};

let projects = [];

const dataManagement = function(){

function initializeLocalStorage(){

    if(localStorage.getItem("visited") === null){
        
        localStorage.setItem("visited", "true");

        const initialData = JSON.stringify([{   title: "Omelette shopping",
            description: "Buy all ingredients to make an omelette",
            dueDate: "2025-03-25",
            checkList: [[false, "buy eggs", 1, 1812822840000],
                        [true, "buy oil", 1], 1812822840000,
                        [false, "buy salt", 1,1812822840000]]
        },
        {   title: "Vegas trip",
            description: "Do things that will stay in vegas",
            dueDate: "2025-03-25",
            checkList: [[true, "do powder", 2, 1812822840000],
                        [false, "cross dress", 2, 1812822840000],
                        [false, "gamble away all savings", 1, 1812822840000]]
        },
        {   title: "Virus upgrade",
            description: "Operate gain of function research",
            dueDate: "2025-03-25",
            checkList: [[false, "modify genes", 3, 1812822840000],
                        [false, "wear hazmat",3, 1812822840000],
                        [true, "inject bats with result", 1, 1812822840000]]
        }
        ]);
        localStorage.setItem("projects", initialData);

    };
    fillProjectsFromLocalStorage();
};

function fillProjectsFromLocalStorage(){
    projects = JSON.parse(localStorage.getItem("projects"));
};

function updateStorage(){
    const projectsString = JSON.stringify(projects);
    localStorage.setItem("projects", projectsString);
    console.log("storage updated");
    console.log(localStorage.getItem("projects"));
};

const addProject = function(project){
    projects.push(project);
};

const deleteProject = function(index){
                projects.splice(index, 1);
};

const deleteTask = function(pIndex, tIndex){
    projects[pIndex].checkList.splice(tIndex, 1);
    console.log('deleting');
};

const toggleTask = function(pIndex, tIndex){
    
    if(projects[pIndex].checkList[tIndex][0] === true){
            projects[pIndex].checkList[tIndex][0] = false;
    }else{
        projects[pIndex].checkList[tIndex][0] = true;
    };
};

            return {initializeLocalStorage,updateStorage,addProject, deleteProject, deleteTask, toggleTask};
            
        };