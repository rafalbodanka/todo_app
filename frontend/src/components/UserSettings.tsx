import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Input, Avatar, Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  level?: string;
  userIconId: number;
}

type userSettingsProps = {
  user: User;
  isMobile: boolean;
};

const UserSettings: React.FC<userSettingsProps> = ({ user, isMobile }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setlevel] = useState("");
  const [userIconId, setUserIconId] = useState(Number);
  const [userImage, setUserImage] = useState("");
  const totalIcons = 20; // Total number of icons
  const userIcons = Array.from(
    { length: totalIcons },
    (_, index) => `${index + 1}`
  );

  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLevelValid, setIsLevelValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [invalidFirstNameMessage, setInvalidFirstNameMessage] =
    useState("Invalid first name");
  const [invalidLastNameMessage, setInvalidLastNameMessage] = useState(
    "Last name must have 8-30 characters"
  );
  const [invalidEmailMessage, setInvalidEmailMessage] =
    useState("Invalid email");
  const [invalidLevelMessage, setInvalidLevelMessage] =
    useState("Invalid level");
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState(
    "Password must have 8-30 characters"
  );

  const [isEdited, setIsEdited] = useState(false);
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setUserIconId(user.userIconId);
      if (user.level) {
        setlevel(user.level);
      }
    }
  }, [user]);

  const [isEditUserIconVisible, setIsEditUserIconVisible] = useState(false);

  const handleSetUserImage = (icon: string) => {
    setUserIconId(Number(icon));
    if (Number(icon) !== user.userIconId) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  };

  const handleFirstNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstName(event.target.value);
    if (event.target.value !== user.firstName) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
    setIsFirstNameValid(true);
  };

  const handleLastNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLastName(event.target.value);
    if (event.target.value !== user.lastName) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
    setIsLastNameValid(true);
  };

  const handleLevelOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setlevel(event.target.value);
    if (event.target.value !== user.level) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
    setIsLevelValid(true);
  };

  const handleEmailOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (event.target.value !== user.email) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
    setIsEmailValid(true);
  };

  const validateRegisterData = (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): boolean => {
    let isValid = true;

    //first name validation
    if (!/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(firstName)) {
      setInvalidFirstNameMessage("First name should contain only letters");
      setIsFirstNameValid(false);
      isValid = false;
    }
    if (firstName.length > 46) {
      setInvalidFirstNameMessage("First name is too long.");
      setIsFirstNameValid(false);
      isValid = false;
    }
    //last name validation
    if (!/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(lastName)) {
      setInvalidLastNameMessage("Last name should contain only letters");
      setIsLastNameValid(false);
      isValid = false;
    }

    if (lastName.length > 46) {
      setInvalidLastNameMessage("First name is too long.");
      setIsLastNameValid(false);
      isValid = false;
    }

    //level validation
    if (level.length > 46) {
      setInvalidLevelMessage("Level is too long.");
      setIsLevelValid(false);
      isValid = false;
    }
    //email validation
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length < 5 ||
      email.length > 100
    ) {
      setInvalidEmailMessage("Invalid email");
      setIsEmailValid(false);
      isValid = false;
    }
    return isValid;
  };

  const handleUserDataUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const isUpdateDataValid = validateRegisterData(
      firstName,
      lastName,
      email,
      level
    );
    if (!isUpdateDataValid) return;
    try {
      const response = await axios.patch(
        "http://localhost:5000/users/user/update",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          level: level,
          userIconId: userIconId,
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
        setIsEditSuccessful(true);
        setIsEdited(false);

        setTimeout(() => {
          setIsEditSuccessful(false);
        }, 3000);
      }
    } catch (err: any) {
      if (err.response.data.message.includes("Email")) {
        setInvalidEmailMessage("Email already exists");
        setIsEmailValid(false);
      }
      setIsEdited(false);
    }
  };

  return (
    <div className={`${isMobile ? "p-4" : "p-16"} text-black`}>
      <a href="/" className="inline-block text-md no-underline">
        <Button className="bg-purple-900 flex items-center shadow-gray-400 hover:shadow-gray-400">
          <img src="./arrow-left.svg"></img>
          <p className="ml-4">go back to the planner</p>
        </Button>
      </a>
      <p className={`text-xl mt-16 flex items-center ${isMobile && "justify-center"}`}>
        <img src="./settings-wheel.svg"></img>
        <span className="ml-2">Account settings</span>
      </p>
      <div className={`${!isMobile && "w-72"} mt-8`}>
      <Popover placement={`${isMobile ? "bottom" : "right"}`}>
        <PopoverHandler>
        <div className="flex justify-center">
          <label
            htmlFor="file"
            className="relative cursor-pointer"
            onMouseEnter={() => setIsEditUserIconVisible(true)}
            onMouseLeave={() => setIsEditUserIconVisible(false)}
          >
            <Avatar
              className="w-32 h-32"
              src={
                userIconId === 0
                  ? "./avatar.png"
                  : `./userIcons/${userIconId}.svg`
              }
            ></Avatar>
            <img
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 w-1/3 -translate-y-1/2 opacity-0 duration-200 ${
                isEditUserIconVisible && "opacity-100"
              }`}
              src="./edit-file.svg"
            ></img>
          </label>
        </div>
        </PopoverHandler>
        <PopoverContent className="p-0">
          <div>
            <div className="bg-gray-200 rounded-lg shadow-lg">
              <div className={`${isMobile && "w-screen"} h-64 p-6 overflow-y-auto scrollbar-none`}>
                <div className={`grid ${isMobile ? "grid-cols-3" : "grid-cols-4"} gap-4`}>
                  {userIcons.map((icon) => (
                    <img
                      key={icon}
                      src={`./userIcons/${icon}.svg`}
                      onClick={() => handleSetUserImage(icon)}
                      alt="Profile Icon"
                      className="cursor-pointer shadow-sm shadow-gray-600 hover:shadow-2xl rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
        <form>
          <div className="flex justify-center">
            <div className="grid gap-4 mt-8">
              <div>
                <label>First name</label>
                <div className="w-72">
                  <Input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={handleFirstNameOnChange}
                    className="focus:!border-t-blue-500 focus:!border-blue-500 ring-4 ring-transparent focus:ring-blue-500/20 !border !border-blue-gray-50 bg-white shadow-lg shadow-blue-gray-900/5 placeholder:text-blue-gray-200 text-blue-gray-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </div>
                {!isFirstNameValid && (
                  <p className="text-sm text-red-400">
                    {invalidFirstNameMessage}
                  </p>
                )}
              </div>
              <div>
                <label>Last name</label>
                <div className="w-72">
                  <Input
                    label="Last name"
                    placeholder="Doe"
                    value={lastName}
                    onChange={handleLastNameOnChange}
                    type="text"
                    className="focus:!border-t-blue-500 focus:!border-blue-500 ring-4 ring-transparent focus:ring-blue-500/20 !border !border-blue-gray-50 bg-white shadow-lg shadow-blue-gray-900/5 placeholder:text-blue-gray-200 text-blue-gray-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </div>
                {!isLastNameValid && (
                  <p className="text-sm text-red-400">{invalidLastNameMessage}</p>
                )}
              </div>
              <div>
                <label>Level</label>
                <div className="w-72">
                  <Input
                    type="text"
                    placeholder="Junior consultant"
                    value={level}
                    onChange={handleLevelOnChange}
                    className="focus:!border-t-blue-500 focus:!border-blue-500 ring-4 ring-transparent focus:ring-blue-500/20 !border !border-blue-gray-50 bg-white shadow-lg shadow-blue-gray-900/5 placeholder:text-blue-gray-200 text-blue-gray-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </div>
                {!isLevelValid && (
                  <p className="text-sm text-red-400">{invalidLevelMessage}</p>
                )}
              </div>
              <div>
                <label>Email</label>
                <div className="w-72">
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={handleEmailOnChange}
                    className="focus:!border-t-blue-500 focus:!border-blue-500 ring-4 ring-transparent focus:ring-blue-500/20 !border !border-blue-gray-50 bg-white shadow-lg shadow-blue-gray-900/5 placeholder:text-blue-gray-200 text-blue-gray-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </div>
              </div>
              {!isEmailValid && (
                <p className="text-sm text-red-400">{invalidEmailMessage}</p>
              )}
            </div>
          </div>
          <div className={`text-purple-900 mt-4 cursor-pointer ${isMobile && "flex justify-center"}`}>
            <Link to="/changepassword">Change password</Link>
          </div>
          <div className="flex justify-center">
            <Button
              className="bg-purple-900 mt-4 shadow-gray-400 hover:shadow-gray-400"
              onClick={handleUserDataUpdate}
              disabled={!isEdited}
            >
              Save
            </Button>
          </div>
          {isEditSuccessful && (
            <div className="flex justify-center mt-8">
              <p className="text-purple-900 font-700">
                User edited succesfully!
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserSettings;