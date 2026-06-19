import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FlowBuilder from '../pages/FlowBuilder';
import FlowList from '../pages/FlowList';

// A simple placeholder page for multiple routes demonstration


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Define multiple routes here */}
        <Route path="/" element={<FlowList />} />
        <Route path="/builder/:flowId" element={<FlowBuilder />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}