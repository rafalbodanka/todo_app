import axios from "axios";
import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useAppSelector } from '../redux/hooks';
import { selectUser } from "../redux/user";

const ChangePassword = () => {
  const user = useAppSelector(selectUser);
  const userId = user._id;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedNewPassword, setConfirmedNewPassword] = useState("");
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(true);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
  const [invalidNewPasswordMessage, setInvalidNewPasswordMessage] =
    useState("");
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isResultSuccess, setIsResultSucess] = useState(true);
  const [resultModalMessage, setResultModalMessage] = useState("");
  const [invalidOldPasswordMessage, setInvalidOldPasswordMessage] = useState(
    "Incorrect password."
  );
  const [
    invalidConfirmedNewPasswordMessage,
    setInvalidConfirmedNewPasswordMessage,
  ] = useState("Passwords don't match.");
  const [isConfirmedNewPasswordValid, setIsConfirmedNewPasswordValid] =
    useState(true);

  const handleOldPasswordOnChange = (event: any) => {
    setOldPassword(event?.target.value);
    setIsOldPasswordValid(true);
  };

  const handleNewPasswordOnChange = (event: any) => {
    setNewPassword(event?.target.value);
    setIsNewPasswordValid(true);
  };

  const handleConfirmedNewPasswordOnChange = (event: any) => {
    setConfirmedNewPassword(event?.target.value);
    setIsConfirmedNewPasswordValid(true);
  };

  const validatePasswordChange = (
    oldPassword: string,
    newPassword: string,
    confirmedNewPassword: string
  ) => {
    let isValid = true;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword) === false) {
      setInvalidNewPasswordMessage(
        "Enter least one number and special character"
      );
      setIsNewPasswordValid(false);
      isValid = false;
    }
    if (newPassword.length < 8 || newPassword.length > 30) {
      setInvalidNewPasswordMessage(
        "Password must have 8-30 characters, one number and one special character"
      );
      setIsNewPasswordValid(false);
      isValid = false;
    }
    if (newPassword !== confirmedNewPassword) {
      setIsConfirmedNewPasswordValid(false);
    }

    return isValid;
  };

  const handlePasswordChange = async (event: any) => {
    event.preventDefault();
    if (!validatePasswordChange(oldPassword, newPassword, confirmedNewPassword))
      return;
    try {
      const response = await axios.patch(
        "http://localhost:5000/users/user/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmedNewPassword: confirmedNewPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setResultModalMessage("Password changed succesfully.");
        setIsResultSucess(true);
        setIsResultModalOpen(true);
      }
    } catch (err: any) {
      setResultModalMessage("Something went wrong, try again.");
      setIsResultSucess(false);
      setIsResultModalOpen(true);
    }
  };

  //loggin out user after successful password change
  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users/logout", {
        withCredentials: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
      }
    } catch (err) {}
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="p-12 pb-10 bg-slate-300 rounded-xl shadow-xl w-80">
          <form className="">
            <div className="relative">
              <Input
                color="deep-purple"
                label="Old password"
                value={oldPassword}
                onChange={handleOldPasswordOnChange}
                id="password"
                autoComplete="password"
                type="password"
              />
            </div>
            <div className="relative mt-4">
              <Input
                error={!isNewPasswordValid}
                aria-describedby={invalidNewPasswordMessage}
                label="New password"
                value={newPassword}
                onChange={handleNewPasswordOnChange}
                id="password"
                type="password"
                color="deep-purple"
              />
            </div>
            <p className="text-xs text-red-400 max-w-32">
              {!isNewPasswordValid && invalidNewPasswordMessage}
            </p>
            <div className="relative mt-4">
              <Input
                label="Confirm new password"
                value={confirmedNewPassword}
                onChange={handleConfirmedNewPasswordOnChange}
                id="password"
                type="password"
                color="deep-purple"
              />
            </div>
            <p className="text-xs text-red-400">
              {!isConfirmedNewPasswordValid &&
                invalidConfirmedNewPasswordMessage}
            </p>
            <div className="flex justify-center items-center">
              <button
                className="bg-purple-900 p-2 pl-5 pr-5 mt-8 rounded-lg hover:bg-purple-800 text-white duration-200 font-700"
                onClick={handlePasswordChange}
              >
                Change password
              </button>
            </div>
            <div className="flex justify-center items-center mt-4">
              <Link to="/user">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
      {isResultModalOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <p className="flex justify-center">{resultModalMessage}</p>
            {isResultSuccess ? (
              <>
                <p className="flex justify-center">
                  You can now log in with new password.
                </p>
                <div className="flex justify-center mt-4">
                  <a href="/login">
                    <Button className="bg-purple-900" onClick={handleLogout}>
                      Log in
                    </Button>
                  </a>
                </div>
              </>
            ) : (
              <div className="flex justify-center mt-4">
                <Button
                  className="bg-purple-900"
                  onClick={() => setIsResultModalOpen(false)}
                >
                  OK
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
