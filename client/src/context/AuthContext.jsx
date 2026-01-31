import {  createContext, useContext, useEffect, useState } from "react";
import api from "../configs/api";
import { toast } from "react-hot-toast";

const AuthContext=createContext({
    isLoggedIn:false,
    setIsLoggedIn:()=>{},
    user:null,
    setUser:()=>{},
    loading:false,
    login:async ()=>{},
    signup:async ()=>{},
    logout:async ()=>{},
})

export const AuthProvider=({children})=>{
    
    const [user,setUser]=useState(null)
    const [isLoggedIn,setIsLoggedIn]=useState(false)
    const [loading,setLoading]=useState(false)
    const signup=async ({name,email,password})=>{
        try {
            setLoading(true)
            const {data}=await api.post('/api/auth/register',{name,email,password})  
            if(data.user){
                setUser(data.user)
                setIsLoggedIn(true)
            } 
            toast.success(data.message)
        } catch (error) {
          console.log(error)
          toast.error(error.response?.data?.message || 'Signup failed')  
        } finally {
            setLoading(false)
        }
    }
    const login=async ({email,password})=>{
       try {
        setLoading(true)
        const {data}=await api.post('/api/auth/login',{email,password})
        if(data.user)   {   
            setUser(data.user)
            setIsLoggedIn(true)
            toast.success(data.message || 'Login successful')
        }
        
       } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || 'Login failed')  
       } finally {
        setLoading(false)
       }
    }       
    const logout=async ()=>{
        try {
            setLoading(true)
            const {data}=await api.post('/api/auth/logout')
            setUser(null)
            setIsLoggedIn(false)
            toast.success(data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Logout failed')  
        } finally {
            setLoading(false)
        }

    }
    const fetchUser=async ()=>{
        try {
            const {data}=await api.get('/api/auth/verify')
            if(data.user){
                setUser(data.user)
                setIsLoggedIn(true)
            }            
        } catch (error) {
            console.log(error)  
        }
    }

    useEffect(()=>{ 
        (async ()=>{
            await fetchUser()
        })()
    },[])

    const value={
        user,setUser,isLoggedIn,setIsLoggedIn,loading, login,signup, logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>useContext(AuthContext);