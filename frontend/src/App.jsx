// import './index.css'
import { Navigate, Route,Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/loginPage"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"

import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
const {data:authUser,isLoading}=useQuery({      	// authUser is not directly storing the data fetched from the API; rather, it is a variable that holds the extracted data from the object returned by useQuery .
	// we use query key to give unique name to our query and can be access anywhere Later.
	queryKey:['authUser'],
													// 	• queryKey: This is an array that uniquely identifies
													// the query. The key is used to cache and retrieve the query data.
	queryFn: async ()=>{
		try {            
			const res = await fetch("/api/auth/me");
			const data= await res.json()
			if(data.error) return null
			if(!res.ok){
				throw new Error(data.error ||"Something went wrong")  
																	//• new Error(data.error ll "Something went wrong")creates a new Error object. The Error constructortakes a message as an argument, which describes what went wrong.
																	//• The throw keyword is used to throw the erro object created by new Error(...) . This will stop the
																	//execution of the current function and propagate the
																	// error up the call stack, where it can be caught and
																	// handled by a try...catch block or will terminate the
																	// script if not caught.
			}
			console.log(data);
			return data;
		} catch (error) {
			throw new Error(error)
		}
	},
	retry:false //only load onces 
});
if (isLoading) {
	return (
		<div className='h-screen flex justify-center items-center'>
			<LoadingSpinner size='lg' />
		</div>
	);
}

  return (
    <div className='flex max-w-6xl mx-auto'>	
		{/* any thing outside Routes compontent is common component */}
			{authUser && <Sidebar />}
			<Routes>
			<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />

		</div>  
  )
}

export default App



