import { Link } from "react-router-dom";
import { useState } from "react";
import useLogin from "../hooks/useLogin"; // ✅ import the login hook

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username || !password) return alert("Please fill all fields");
		await login(username, password); // ✅ call the hook function
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-white'>
					Login <span className='text-blue-500'>ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Username</span>
						</label>
						<input
							type='text'
							placeholder='Enter username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='w-full input input-bordered h-10'
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full input input-bordered h-10'
						/>
					</div>

					<Link
						to='/signup'
						className='text-sm hover:underline text-white hover:text-blue-600 mt-2 inline-block'
					>
						Don't have an account?
					</Link>

					<div>
						<button type='submit' className='btn btn-block btn-sm mt-2' disabled={loading}>
							{loading ? "Logging in..." : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
