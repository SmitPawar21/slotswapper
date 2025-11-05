import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const colors = {
    background: "#040D12",
    cardBg: "#183D3D",
    border: "#5C8374",
    textLight: "#93B1A6",
    textWhite: "#ffffff",
    primary: "#A27B5C",
    primaryHover: "#b58e70",
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
};

const RequestPage = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const token = Cookies.get("token");

    const fetchPendingRequests = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/swap/pending-slots`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            console.log(data);

            setPendingRequests(data);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            toast.error(error)
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleAccept = async (request) => {
        console.log("Accepting request:", request);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/swap/respond`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    accepted: "true",
                    requestId: request.requesterId._id
                })
            });
            const data = await response.json();
            toast.success("ACCEPT sent");
        } catch (Err) {
            console.log(Err);
            toast.error(Err)
        }

    };

    const handleReject = async (request) => {
        console.log("Rejecting request:", request);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/swap/respond`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    accepted: "false",
                    requestId: request.requesterId._id
                })
            });
            const data = await response.json();
            toast.success("REJECT sent");
        } catch (Err) {
            console.log(Err);
            toast.error(Err);
        }

    };

    return (
        <div
            className="min-h-screen p-6"
            style={{ backgroundColor: colors.background }}
        >
            <ToastContainer
                position="top-right"
                autoClose={3000}   
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                theme="colored"   
            />
            <Navbar />
            <Typography
                variant="h4"
                className="text-center mb-6"
                style={{ color: colors.textWhite, marginTop: "20px" }}
            >
                Request Received List
            </Typography>

            <TableContainer
                component={Paper}
                style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    marginTop: "20px",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: colors.background }}>
                            {/* Updated Header */}
                            <TableCell
                                style={{
                                    color: colors.textWhite,
                                    fontWeight: "bold",
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                Event Type
                            </TableCell>
                            <TableCell
                                style={{
                                    color: colors.textWhite,
                                    fontWeight: "bold",
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                Event Name
                            </TableCell>
                            <TableCell
                                style={{
                                    color: colors.textWhite,
                                    fontWeight: "bold",
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                From Time
                            </TableCell>
                            <TableCell
                                style={{
                                    color: colors.textWhite,
                                    fontWeight: "bold",
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                To Time
                            </TableCell>
                            <TableCell
                                style={{
                                    color: colors.textWhite,
                                    fontWeight: "bold",
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                Date
                            </TableCell>
                            <TableCell
                                style={{
                                    color: colors.textWhite,
                                    fontWeight: "bold",
                                    borderBottom: `1px solid ${colors.border}`,
                                }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingRequests.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    style={{
                                        color: colors.textLight,
                                        borderBottom: `1px solid ${colors.border}`,
                                        padding: "2rem",
                                    }}
                                >
                                    No pending swap requests.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pendingRequests.map((request) => (
                                <React.Fragment key={request.requesterEventId._id}>
                                    {/* Row 1: The Requester's Event */}
                                    <TableRow
                                        style={{
                                            "&:hover": { backgroundColor: colors.background },
                                            "& > *": { borderBottom: "none" },
                                        }}
                                    >
                                        <TableCell
                                            style={{
                                                color: colors.textWhite,
                                                fontWeight: "bold",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            Request From:<br />
                                            <p style={{ color: colors.primary }}>{request.requesterId.name}</p>
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: colors.textWhite,
                                                verticalAlign: "top",
                                            }}
                                        >
                                            {request.requesterEventId.title}
                                        </TableCell>
                                        <TableCell
                                            style={{ color: colors.textLight, verticalAlign: "top" }}
                                        >
                                            {formatTime(request.requesterEventId.startTime)}
                                        </TableCell>
                                        <TableCell
                                            style={{ color: colors.textLight, verticalAlign: "top" }}
                                        >
                                            {formatTime(request.requesterEventId.endTime)}
                                        </TableCell>
                                        <TableCell
                                            style={{ color: colors.textLight, verticalAlign: "top" }}
                                        >
                                            {formatDate(request.requesterEventId.startTime)}
                                        </TableCell>
                                        {/* Action cell spans 2 rows */}
                                        <TableCell
                                            style={{
                                                borderBottom: `1px solid ${colors.border}`,
                                                verticalAlign: "middle",
                                            }}
                                            rowSpan={2}
                                        >
                                            <Box display="flex" flexDirection="column" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleAccept(request)}
                                                    style={{
                                                        backgroundColor: colors.primary,
                                                        color: colors.textWhite,
                                                    }}
                                                    onMouseOver={(e) =>
                                                    (e.target.style.backgroundColor =
                                                        colors.primaryHover)
                                                    }
                                                    onMouseOut={(e) =>
                                                        (e.target.style.backgroundColor = colors.primary)
                                                    }
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleReject(request)}
                                                    style={{
                                                        borderColor: colors.primary,
                                                        color: colors.primary,
                                                    }}
                                                    onMouseOver={(e) =>
                                                    (e.target.style.backgroundColor =
                                                        "rgba(162, 123, 92, 0.1)")
                                                    }
                                                    onMouseOut={(e) =>
                                                        (e.target.style.backgroundColor = "transparent")
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>

                                    {/* Row 2: Your Event (Receiver) */}
                                    <TableRow
                                        style={{
                                            "&:hover": { backgroundColor: colors.background },
                                        }}
                                    >
                                        <TableCell
                                            style={{
                                                color: colors.textLight,
                                                borderBottom: `1px solid ${colors.border}`,
                                            }}
                                        >
                                            Your Event (for)
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: colors.textWhite,
                                                borderBottom: `1px solid ${colors.border}`,
                                            }}
                                        >
                                            {request.receiverEventId.title}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: colors.textLight,
                                                borderBottom: `1px solid ${colors.border}`,
                                            }}
                                        >
                                            {formatTime(request.receiverEventId.startTime)}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: colors.textLight,
                                                borderBottom: `1px solid ${colors.border}`,
                                            }}
                                        >
                                            {formatTime(request.receiverEventId.endTime)}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                color: colors.textLight,
                                                borderBottom: `1px solid ${colors.border}`,
                                            }}
                                        >
                                            {formatDate(request.receiverEventId.startTime)}
                                        </TableCell>
                                        {/* No action cell here, it's covered by rowSpan */}
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default RequestPage;