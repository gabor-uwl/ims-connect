import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { EmployeeContext } from './Employee';
import LoginPage from '../pages/Login_Page';
import IdeaBoardPage from '../pages/IdeaBoard_Page';
import ProjectsPage from '../pages/Projects_Page';
import MyIdeasPage from '../pages/MyIdeas_Page';
import MyRewardsPage from '../pages/MyRewards_Page';
import ProfilePage from '../pages/Profile_Page';
import LogoutPage from '../pages/Logout_Page';
import VoteIdeaPage from '../pages/VoteIdea_Page';
import EditIdeaPage from '../pages/EditIdea_Page';
import ProjectBoardPage from '../pages/ProjectBoard_Page';
import TaskPage from '../pages/Task_Page';
import TeamMemberPage from '../pages/TeamMember_Page';
import backgroungImage from '../assets/images/airplane.jpg';



export default function MainComponent() {
  const employeeLoggedIn = useContext(EmployeeContext).loggedIn;

  return (
    <main className="vh-100 text-center" 
      style={{paddingTop: "60px", paddingBottom: "25px", 
      backgroundImage: `url(${backgroungImage})`, backgroundSize: "cover"}}>
    {employeeLoggedIn ? (
      <Routes>
        <Route path='/' element={<IdeaBoardPage/>}/>
        <Route path='/ideas/:ideaId' element={<VoteIdeaPage/>}/>
        <Route path='/projects' element={<ProjectsPage/>}/>
        <Route path='/projects/:projectId' element={<ProjectBoardPage/>}/>
        <Route path='/projects/:projectId/:taskId' element={<TaskPage/>}/>
        <Route path='/projects/:projectId/teammember' element={<TeamMemberPage/>}/>
        <Route path='/myideas' element={<MyIdeasPage/>}/>
        <Route path='/myideas/:ideaId' element={<EditIdeaPage/>}/>
        <Route path='/myrewards' element={<MyRewardsPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/logout' element={<LogoutPage/>}/>
      </Routes>
    ):(
      <LoginPage/>
    )}
    </main>
  );
};