export {projects, initializeLocalStorage,updateStorage, deleteProject};

let projects = [];



function initializeLocalStorage(){

    if(localStorage.getItem("visited") === null){
        
        localStorage.setItem("visited", "true");

        const initialData = JSON.stringify([{   title: "Omelette chopping",
            description: "buy all ingredients to make an omelette",
            dueDate: "2025/03/25",
            checkList: [[false, "buy eggs"],
                        [true, "buy oil"],
                        [false, "buy salt"]]
        },
        {   title: "Vegas trip",
            description: "Do things that will stay there",
            dueDate: "2025/03/25",
            checkList: [[true, "do poweder"],
                        [false, "cross dress"],
                        [false, "gamble away all savings"]]
        },
        {   title: "Virus upgrade",
            description: "operate gain of function research",
            dueDate: "2025/03/25",
            checkList: [[false, "modify genes"],
                        [false, "wear hazmat"],
                        [true, "inject bats with result"]]
        }
        ]);
        localStorage.setItem("projects", initialData);

    }else{

    projects = JSON.parse(localStorage.getItem("projects"));
    console.log(projects);
    };
};



function updateStorage(){
    const projectsString = JSON.stringify(projects);
    localStorage.setItem("projects", projectsString);
    console.log("storage updated");
    console.log(localStorage.getItem("projects"));
};


const deleteProject = function(index){
                projects.splice(index, 1);
            }