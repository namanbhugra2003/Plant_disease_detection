import React from "react";
import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import PrivateRoute from "./components/PrivateRoute";


import CreateForm from "./Pages/CreateForm";
import UserProfile from "./Pages/UserProfile";
import AiRecomendationForm from "./Pages/AiRecomendationForm";
import UpdateSubmittedForm from "./Pages/UpdateSubmittedForm";
import DeleteSubmittedForm from "./Pages/DeleteSubmittedForm";
import MyInquiries from "./Pages/MyInquiries";
import Dashboard from "./components/Dashboard";
import ManagerResponses from "./Pages/ManagerResponses";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./components/Navbar";
import LogNavBar from "./components/LogingNavBar";
import AdminDashboard from "./Pages/AdminDashboard";
import ArticleView from "./components/ArticleView";
import HomeAfterLogin from "./Pages/HomeAfterLogin";
import UserManagement from "./components/UserManagement";

import HomeMaterial from "./Pages/HomeMaterial";
import CreateMaterial from "./Pages/CreateMaterial";
import ShowMaterial from "./Pages/ShowMaterial";
import EditMaterial from "./Pages/EditMaterial";
// import DeleteMaterial from './pages/DeleteMaterial';
import BuyMaterial from "./Pages/BuyMaterial";
import SupplierAnalytics from "./Pages/SupplierAnalytics";

import MyInquiriez from "./Pages/MyInquiriez";
import ManagerDashboard from "./Pages/ManagerDashboard";
import ManagerAlertForm from "./Pages/ManagerAlertForm";
import UpdateAlerts from "./Pages/UpdateAlerts";

import PlantDiseaseIdentifier from "./Pages/apitest";

const App = () => {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Navbar />
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loghome" element={<HomeAfterLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/articles" element={<AdminDashboard />} />
          <Route path="/admin/articles/create" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          <Route path="/lognavbar" element={<LogNavBar />} />
          <Route path="/admin/manageusers" element={<UserManagement />} />
          <Route path="/viewarticles" element={<ArticleView />} />
          <Route path="/admin/viewarticle" element={<ArticleView />} />

          {/* Inquiry Form & AI Recommendation Routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="createinquiry" element={<CreateForm />} />
            <Route path="updateinquiry/:id" element={<UpdateSubmittedForm />} />
            <Route path="deleteinquiry/:id" element={<DeleteSubmittedForm />} />
            <Route path="aitreatment" element={<AiRecomendationForm />} />
            <Route path="myinquiries" element={<MyInquiries />} />
            <Route path="userprofile" element={<UserProfile />} />
            <Route path="managerresponses" element={<ManagerResponses />} />
          </Route>

          <Route path="/my-inquiriez" element={<MyInquiriez />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/alert" element={<ManagerAlertForm />} />
          <Route path="/manager/alerts/manage" element={
            <PrivateRoute allowedRoles={["manager"]}>
            <UpdateAlerts />
            </PrivateRoute>
            }/>


          <Route path="/materials" element={<HomeMaterial />} />
          <Route path="/materials/create" element={<CreateMaterial />} />
          <Route path="/materials/details/:id" element={<ShowMaterial />} />
          <Route path="/materials/edit/:id" element={<EditMaterial />} />
          {/* <Route path='/materials/delete/:id' element={<DeleteMaterial />} /> */}
          <Route path="/materials/buy" element={<BuyMaterial />} />
          <Route path="/materials/analytics" element={<SupplierAnalytics />} />
          <Route path="/plantapi" element={<PlantDiseaseIdentifier />} />
        </Routes>
      </SnackbarProvider>
    </>
  );
};

export default App;
