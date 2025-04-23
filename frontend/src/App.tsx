import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useAuthContext } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import FloatingIcons from "./components/FloatingIcons";

function App() {
	const { authUser, isLoading } = useAuthContext();

	if (isLoading) return null;

	return (
		<div className="relative h-screen overflow-hidden bg-black">
		<FloatingIcons />
	
			{/* App content */}
			<div className='absolute inset-0 p-4 flex items-center justify-center z-10'>
				<Routes>
					<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
					<Route path='/signup' element={!authUser ? <SignUp /> : <Navigate to={"/"} />} />
					<Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
				</Routes>
				<Toaster />
			</div>
		</div>
	
	);
	
}

export default App;
