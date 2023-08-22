import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import CancelInvitation from "./CancelInvitation";
import AcceptInvitation from "./AcceptInvitations";
import type { Invitation } from "../utils/Types";
import { useAppSelector } from "../../redux/hooks";
import { isMobileValue } from "../../redux/isMobile";
import arrowLeft from "../../images/arrow-left.svg"
import invitationImg from "../../images/invitation-icon.png"


const UserInvitations = () => {
  const isMobile = useAppSelector(isMobileValue)

  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>(
    []
  );
  const [invitationsRerenderSignal, setInvitationsRerenderSignal] =
    useState(false);

  useEffect(() => {
    const getUsersReceivedInvitations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/invitations/get/invitee`,
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        setReceivedInvitations(response.data);
      } catch (err) {}
    };
    getUsersReceivedInvitations();
  }, [invitationsRerenderSignal]);

  useEffect(() => {
    const getUsersSetInvitations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/invitations/get/inviter`,
          {
            withCredentials: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        );
        setSentInvitations(response.data);
      } catch (err) {}
    };

    getUsersSetInvitations();
  }, [invitationsRerenderSignal]);

  return (
    <div className="p-4 md:p-16 w-screen">
      <div>
        <a href="/" className="inline-block text-md no-underline">
          <Button className="bg-purple-900 flex items-center shadow-gray-400 hover:shadow-gray-400">
            <img src={arrowLeft}></img>
            <p className="ml-4">go back to the planner</p>
          </Button>
        </a>
        <div className="md:w-[600px]">
          <p className="text-xl mt-16 flex items-center">
            <img src={invitationImg}></img>
            <span className="ml-2">Your invitations</span>
          </p>
          <div className="mt-12">
            {receivedInvitations.length < 1 ? (
              <p>You haven't received any invitations.</p>
            ) : (
              <div className=" rounded-lg bg-gray-200">
                {" "}
                {receivedInvitations.map((invitation) => (
                  <div key={invitation._id} className="grid grid-cols-10 p-4">
                    <p className={`${isMobile ? "col-span-8" : "col-span-6"} flex items-center`}>
                      <span>
                        <span className="font-bold">
                          {invitation.inviterEmail}
                        </span>
                        &nbsp;invited you to table&nbsp;
                        <span className="font-bold">{invitation.tableName}</span>
                      </span>
                    </p>
                    {
                      isMobile ? 
                      <div className={`${isMobile ? "col-span-2" : "col-span-4"} flex items-center`}>
                        <Popover>
                          <PopoverHandler>
                            <Button color="white" size="sm" className="px-2 sm:px-4">
                              Action
                            </Button>
                          </PopoverHandler>
                          <PopoverContent>
                            <div className="grid grid-flow-row gap-4">
                              <CancelInvitation
                                buttonText="Reject"
                                invitationId={invitation._id}
                                userId={invitation.inviter}
                                invitationsRerenderSignal={invitationsRerenderSignal}
                                setInvitationsRerenderSignal={
                                  setInvitationsRerenderSignal
                                }
                              />
                                <AcceptInvitation
                                invitationId={invitation._id}
                                userId={invitation.inviter}
                                invitationsRerenderSignal={invitationsRerenderSignal}
                                setInvitationsRerenderSignal={
                                  setInvitationsRerenderSignal
                                }
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      :
                      <div className="flex justify-center col-span-4 gap-4">
                        <AcceptInvitation
                          invitationId={invitation._id}
                          userId={invitation.inviter}
                          invitationsRerenderSignal={invitationsRerenderSignal}
                          setInvitationsRerenderSignal={
                            setInvitationsRerenderSignal
                          }
                        />
                        <CancelInvitation
                          buttonText="Reject"
                          invitationId={invitation._id}
                          userId={invitation.inviter}
                          invitationsRerenderSignal={invitationsRerenderSignal}
                          setInvitationsRerenderSignal={
                            setInvitationsRerenderSignal
                          }
                        />
                    </div>
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xl mt-16 flex items-center">
            <img src={invitationImg}></img>
            <span className="ml-2">Sent invitations</span>
          </p>
          <div className="mt-12">
            {sentInvitations.length < 1 ? (
              <p>You have no pending invitations.</p>
            ) : (
              <div className="">
                {sentInvitations.map((invitation) => (
                  <div
                    key={invitation._id}
                    className="grid grid-cols-10 p-4 mt-2 bg-gray-200  rounded-lg "
                  >
                    <p className="col-span-8 flex items-center">
                      <span>
                        You have invited&nbsp;
                        <span className="font-700">
                          {invitation.inviteeEmail}
                        </span>
                        &nbsp;to table&nbsp;
                        <span className="font-700">{invitation.tableName}</span>
                      </span>
                    </p>
                    {
                      isMobile ? 
                      <div className={`${isMobile ? "col-span-2" : "col-span-4"} flex items-center`}>
                        <Popover>
                          <PopoverHandler>
                            <Button color="white" size="sm" className="px-2 sm:px-4">
                              Action
                            </Button>
                          </PopoverHandler>
                          <PopoverContent>
                            <div className="grid grid-flow-row gap-4">
                              <CancelInvitation
                                buttonText="Cancel"
                                invitationId={invitation._id}
                                userId={invitation.inviter}
                                invitationsRerenderSignal={invitationsRerenderSignal}
                                setInvitationsRerenderSignal={
                                  setInvitationsRerenderSignal
                                }
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      :
                    <div className="flex justify-center items-center col-span-2">
                      <CancelInvitation
                        buttonText="Cancel"
                        invitationId={invitation._id}
                        userId={invitation.inviter}
                        invitationsRerenderSignal={invitationsRerenderSignal}
                        setInvitationsRerenderSignal={
                          setInvitationsRerenderSignal
                        }
                      />
                    </div>                   
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInvitations;
