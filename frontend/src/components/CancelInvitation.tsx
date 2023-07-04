import React from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";

type CancelInvitationProps = {
  buttonText: string;
  invitationId: string;
  userId: string;
  invitationsRerenderSignal: boolean;
  setInvitationsRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CancelInvitation: React.FC<CancelInvitationProps> = ({
  buttonText,
  invitationId,
  userId,
  invitationsRerenderSignal,
  setInvitationsRerenderSignal,
}) => {
  const handleCancelInvitation = async () => {
    try {
      await axios.delete(
        `https://todo-app-ten-ivory.vercel.app/invitations/${invitationId}/cancel`,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
    } finally {
      setInvitationsRerenderSignal(!invitationsRerenderSignal);
    }
  };
  return (
    <Button
      onClick={handleCancelInvitation}
      className="bg-red-400 shadow-gray-400 hover:shadow-gray-400"
    >
      {buttonText}
    </Button>
  );
};

export default CancelInvitation;
