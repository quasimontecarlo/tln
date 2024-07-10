import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import Navbar from "./components/common/Navbar";
import ProfilePage from "./pages/profile/ProfilePage";
import WritePage from "./pages/home/WritePage";
import ReadingPage from "./pages/home/ReadingPage";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Picture from "./components/common/Picture";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";


function App() {
	const { data:authUser, isLoading, error, isError } = useQuery({
		queryKey: ["authUser"],
		queryFn: async() => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if(data.error) return null;
				if(!res.ok){
					throw new Error(data.error || "something went wrong");
				}
				return data;
			} catch(error) {
				throw new Error(error);

			}
		},
		retry: false,
	});

	if(isLoading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size="md" />
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto">
			{authUser && <Navbar />}
			<div className="flex">

				<Routes>
					<Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
					<Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
					<Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
					<Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
					<Route path="/write" element={authUser ? <WritePage /> : <Navigate to="/login" />} />
					<Route path="/reading" element={authUser ? <ReadingPage /> : <Navigate to="/login" />} />
					<Route path="/pic/:_id" element={<Picture />}/>
				</Routes>
				{isMobile ?
				<Toaster
				toastOptions={{
					className: "bg-base-100 text-base-content",
					success: {
						iconTheme: {
							primary: "#a3be8c",
							secondary: "#2e3440"
						},
					},
					error: {
						iconTheme: {
							primary: "#bf616a",
							secondary: "#2e3440",
						},
					},
				}} />
				: 
				 <Toaster
				 containerStyle={{
					 top: 57,
				 }}
				 toastOptions={{
					 className: "bg-base-100 text-base-content",
					 success: {
						 iconTheme: {
							 primary: "#a3be8c",
							 secondary: "#2e3440"
						 },
					 },
					 error: {
						 iconTheme: {
							 primary: "#bf616a",
							 secondary: "#2e3440",
						 },
					 },
				 }} />}
			</div>
		</div>
	);
}

export default App
