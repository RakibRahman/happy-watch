import React,{useEffect} from 'react'
import {useAuth} from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
const Profile = () => {
    const { user } = useAuth()!;
    const navigate = useNavigate();
   
useEffect(() => {
if(!user) {
    navigate('*');
}
},[user])
  return (
    <div>Profile</div>
  )
}

export default Profile;