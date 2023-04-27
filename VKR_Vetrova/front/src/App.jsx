import React, { useRef, useState } from "react";
import {Routes, Route} from 'react-router-dom';
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/registration/register";
import { observer } from "mobx-react-lite";
import Forgot from "./pages/forgot/forgot";
import CheckConnection from "./pages/checkConnection/checkConnection";
import MainPage from "./pages/first/firstPage";
import SpeedTest from "./pages/firstInfo/Speed";
import Profile from "./pages/profile/profile";
import IpDetails from "./pages/profile/ip/ipDetails/ipDetails";

const App = () => {
  return(
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/registration" element={<RegisterPage/>}/>
      <Route path="/reset-password" element={<Forgot/> }/>
      <Route path="/" element={<MainPage/> }/>
      <Route path="/info" element={<SpeedTest/> }/>
      <Route path="/profile" element={<Profile/> }/>
      <Route path="/profile/ip/:id" element={<IpDetails />} /> 
    </Routes>
  );
}


export default observer(App);
