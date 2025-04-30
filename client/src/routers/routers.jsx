import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Home, Dashboard, ProjectDashboard, Profile, Project, Interest } from '@/pages';

const Routers = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/project-dashboard" element={<ProjectDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/project/:name" element={<Project />} />
                    <Route path="/interest" element={<Interest />} />
                </Routes>
            </Router>
        </div>
    )
}

export default Routers;