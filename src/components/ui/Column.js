import NewIdeaComponent from "./NewIdea";
import TaskComponent from "./Task";


export default function ColumnComponent({title, ideas=null, tasks=null, type}) {

  return (
    <div className="col m-3">
      <h1 className="text-center m-4" style={{fontFamily: "cursive"}}>{title}</h1>
      <ul className="list-unstyled">
        {(ideas != null) && (ideas.map((idea) => (type === idea.state) && <NewIdeaComponent key={idea.id} idea={idea}/>))}
        {(tasks != null) && (tasks.map((task) => (type === task.state) && <TaskComponent key={task.id} task={task}/>))}
      </ul>
    </div>
  );
};