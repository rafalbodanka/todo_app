import React from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";

type AcceptInvitationProps = {
  invitationId: string;
  userId: string;
  invitationsRerenderSignal: boolean;
  setInvitationsRerenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AcceptInvitation: React.FC<AcceptInvitationProps> = ({
  invitationId,
  userId,
  invitationsRerenderSignal,
  setInvitationsRerenderSignal,
}) => {
  const handleAcceptInvitation = async () => {
    try {
      await axios.post(
        `http://localhost:5000/invitations/${invitationId}/accept`,
        { userId },
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
      onClick={handleAcceptInvitation}
      className="invitation-btn bg-purple-900 shadow-gray-400 hover:shadow-gray-400"
    >
      Accept
    </Button>
  );
};

export default AcceptInvitation;
