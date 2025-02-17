
export {projects, dataManagement};

let projects = [];

const dataManagement = function(){

function initializeLocalStorage(){

    if(localStorage.getItem("visited") === null){
        
        localStorage.setItem("visited", "true");

        const initialData = JSON.stringify([{   title: "Omelette chopping",
            description: "Buy all ingredients to make an omelette",
            dueDate: "2025/03/25",
            checkList: [[false, "buy eggs"],
                        [true, "buy oil"],
                        [false, "buy salt"]]
        },
        {   title: "Vegas trip",
            description: "Do things that will stay there",
            dueDate: "2025/03/25",
            checkList: [[true, "do powder"],
                        [false, "cross dress"],
                        [false, "gamble away all savings"]]
        },
        {   title: "Virus upgrade",
            description: "Operate gain of function research",
            dueDate: "2025/03/25",
            checkList: [[false, "modify genes"],
                        [false, "wear hazmat"],
                        [true, "inject bats with result"]]
        }
        ]);
        localStorage.setItem("projects", initialData);

    }else{

    projects = JSON.parse(localStorage.getItem("projects"));
    };
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