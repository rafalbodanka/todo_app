import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
	const [isEmailInputFocused, setIsEmailInputFocused] = useState(false);
	const [emailInputValue, setEmailInputValue] = useState("");
	const [isEmailInputHovered, setIsEmailInputHovered] = useState(false);
	const [isPasswordInputFocused, setIsPasswordInputFocused] = useState(false);
	const [passwordInputValue, setPasswordInputValue] = useState("");
	const [isPasswordInputHovered, setIsPasswordInputHovered] = useState(false);

	const [isEmailValid, setIsEmailValid] = useState(true)
	const [isPasswordValid, setIsPasswordValid] = useState(true)
	const [invalidEmailMessage, setInvalidEmailMessage] = useState("Invalid email");
	const [invalidPasswordMessage, setInvalidPasswordMessage] = useState("Password must have 8-30 characters");

	const [isRegisteredSuccesfully, setIsRegisteredSuccesfully] = useState(false);

	const navigate = useNavigate();

	const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmailInputValue(e.target.value);
		setIsEmailValid(true)
	};

	const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordInputValue(e.target.value);
		setIsPasswordValid(true)
	};

	const handleEmailInputFocus = () => {
		setIsEmailInputFocused(true);
	};

	const handleEmailInputBlur = () => {
		setIsEmailInputFocused(false);
	};

	const handleEmailInputMouseEnter = () => {
    setIsEmailInputHovered(true);
  };

  const handleEmailInputMouseLeave = () => {
    setIsEmailInputHovered(false);
  };

	const handlePasswordInputFocus = () => {
		setIsPasswordInputFocused(true);
	};

	const handlePasswordInputBlur = () => {
		setIsPasswordInputFocused(false);
	};

	const handlePasswordInputMouseEnter = () => {
    setIsPasswordInputHovered(true);
  };

  const handlePasswordInputMouseLeave = () => {
    setIsPasswordInputHovered(false);
  };

	// register form validation
	const validateRegisterData = (email: string, password: string) => {
		let isValid = true;
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length < 5 || email.length > 100) {
			setInvalidEmailMessage("Invalid email")
			setIsEmailValid(false)
			isValid=false;
		}
		if (password.length < 8 || password.length > 30) {
			setInvalidPasswordMessage("Password must have 8-30 characters, one number and one special character");
			setIsPasswordValid(false)
			isValid=false;
		}
		if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) === false) {
			setInvalidPasswordMessage("Enter least one number and one special character");
			setIsPasswordValid(false)
			isValid=false;
		}
		return isValid;
	}

	// handling login request
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const isRegisterDataValid = validateRegisterData(emailInputValue, passwordInputValue)
		if (!isRegisterDataValid) return;
		try {
			const response = await axios.post('http://localhost:5000/users/signup', {
				'email': emailInputValue,
				'password': passwordInputValue
			})
			console.log(response)
			if (response.status === 201) {
				setIsRegisteredSuccesfully(true);
			}
		} catch (err: any) {
			console.log(err)
			if (err.response.data.message.includes('Email')) {
				setInvalidEmailMessage("User already exists")
				setIsEmailValid(false)
			}
			if (err.response.data.message.includes('password')) {
				setIsPasswordValid(false)
			}
		}
	}


	return (
			<div className="flex justify-center items-center w-screen h-screen">
					<div className="p-10 bg-slate-300 rounded-xl shadow-xl">
					 {!isRegisteredSuccesfully ?
					 	<>
							<form className="">
							<div className="relative"
										onMouseEnter={handleEmailInputMouseEnter}
										onMouseLeave={handleEmailInputMouseLeave}>
									<input
											id="email"
											autoComplete="email"
											type="email"
											className="mb-5 h-14 pl-2 font-Roboto font-700 rounded-lg w-300 focus:outline-none shadow-lg"
											value={emailInputValue}
											onChange={(e) => handleEmailInputChange(e)}
											onFocus={handleEmailInputFocus}
											onBlur={handleEmailInputBlur}
									/>
									<div
											className={`absolute uppercase select-none ${
												(isEmailInputFocused || isEmailInputHovered || emailInputValue) ? "top-0 left-2" : "top-5 left-4"
											} ${isEmailValid ? 'text-slate-500' : 'text-red-500'} font-700 ${
												(isEmailInputFocused || isEmailInputHovered || emailInputValue) ? "text-10" : "text-xs"
											} transition-all duration-500`
											}
											>
											{isEmailValid ? 'email' : invalidEmailMessage}
									</div>
									</div>
										<div className="relative"
													onMouseEnter={handlePasswordInputMouseEnter}
													onMouseLeave={handlePasswordInputMouseLeave}>
										<input
												id="password"
												type="password"
												className="mb-5 h-14 pl-2 font-Roboto font-700 rounded-lg w-300 focus:outline-none shadow-lg"
												value={passwordInputValue}
												onChange={(e) => handlePasswordInputChange(e)}
												onFocus={handlePasswordInputFocus}
												onBlur={handlePasswordInputBlur}
										/>
										<div
												className={`absolute uppercase ${
													(isPasswordInputFocused || isPasswordInputHovered || passwordInputValue) ? "top-0 left-2" : "top-5 left-4"
												} ${isPasswordValid ? 'text-slate-500' : 'text-red-500'} font-700 ${
													(isPasswordInputFocused || isPasswordInputHovered || passwordInputValue) ? "text-10" : "text-xs"
												} transition-all duration-500`
												}
												>
												{isPasswordValid ? 'password' : invalidPasswordMessage}
										</div>
									</div>
									<div className="flex justify-center items-center">
										<button className="bg-purple-400 p-2 pl-5 pr-5 rounded-lg hover:bg-purple-500 text-white duration-200 font-700"
														onClick={(e) => handleLogin(e)}>Sign up</button>
									</div>
							</form>
							<div className="flex justify-center mt-4">
								<p className="mb-0 text-base">Already have an account? <span className="text-purple-500 font-700 cursor-pointer"> <Link to='/login'>Log in</Link></span></p>
							</div>
						</>
						: <p>User created succesfully, you can now <span className="text-purple-500 font-700 cursor-pointer"> <Link to='/login'>Log in</Link></span></p>
						}
					</div>
			</div>
	)
}

export default Register;