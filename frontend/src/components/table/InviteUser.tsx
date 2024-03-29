import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button } from "@material-tailwind/react";
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/user";
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';

type UserProps = {
  tableMembers: string[];
  tableId: string;
  tableName: string;
};

const InviteUser: React.FC<UserProps> = ({
  tableMembers,
  tableId,
  tableName,
}) => {
  const user = useAppSelector(selectUser)

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(Boolean);
  const [emailError, setEmailError] = useState("");
  const [inviteResponseStatusOK, setInviteResponseStatusOK] = useState(true);
  const [isInviteResponseVisible, setIsInviteResponseVisible] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const onEmailChange = (event: any) => {
    setIsInviteResponseVisible(false);
    setEmail(event?.target.value);
  };

  const handleSendInvitation = async () => {
    //email validation
    if (email.length < 5) {
      setEmailError("Email must have at least 5 characters.");
      setIsEmailValid(false);
      return;
    } else if (email.length > 100) {
      setEmailError("Email can't be longer than 100 characters.");
      setIsEmailValid(false);
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email");
      setIsEmailValid(false);
      return;
    }
    if (tableMembers.includes(email)) {
      setResponseMessage("User is here already.");
      setInviteResponseStatusOK(false);
      setIsInviteResponseVisible(true);
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/invitations/create`,
        {
          inviteeEmail: email,
          inviterId: user._id,
          tableId: tableId,
          tableName: tableName,
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
        setInviteResponseStatusOK(true);
        setIsInviteResponseVisible(true);
      }
    } catch (err: any) {
      setInviteResponseStatusOK(false);
      setIsInviteResponseVisible(true);
      if (err.response.data.message.includes("permission")) {
        setResponseMessage(
          "You have no permission to invite. Refresh the page."
        );
      } else {
        setResponseMessage(err.response.data.message);
      }
    }
  };

  return (
    <div>
      <p className="text-black mt-8">Members</p>
      <div className="block md:flex">
        <div className="relative flex w-full max-w-[24rem] mt-2">
          <Input
            error={isEmailValid}
            color="deep-purple"
            type="email"
            label="Email"
            value={email}
            onChange={onEmailChange}
            className="pr-20 mt-0"
            containerProps={{
              className: "min-w-0",
            }}
          />
          <Button
            size="sm"
            color={email ? "deep-purple" : "blue-gray"}
            disabled={!email}
            onClick={handleSendInvitation}
            className="!absolute right-1 top-1 rounded"
          >
            Invite
          </Button>
        </div>
        {isInviteResponseVisible &&
          (inviteResponseStatusOK ? (
            <div className="flex justify-center md:justify-start items-center mt-2 ml-4">
              <CheckOutlineIcon className="w-5 h-5" color="purple"/>
            </div>
          ) : (
            <p className="mt-4 ml-4 flex justify-center md:justify-start items-center text-red-400 text-sm">
              {responseMessage}
            </p>
          ))}
      </div>
      {!isEmailValid && <p className="text-red-400 text-sm">{emailError}</p>}
    </div>
  );
};

export default InviteUser;
