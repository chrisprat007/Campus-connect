import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../components/admin/HomePage';
import NewPost from '../components/admin/NewPost';
import AllPost from '../components/admin/AllPost';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/all-posts" element={<AllPost />} />
      </Routes>
    </Router>
  );
}
