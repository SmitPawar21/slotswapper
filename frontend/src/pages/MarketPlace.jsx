import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";

const colors = {
    background: "#040D12",
    cardBg: "#183D3D",
    border: "#5C8374",
    textLight: "#93B1A6",
    textWhite: "#ffffff",
    primary: "#A27B5C",
    primaryHover: "#b58e70",
};

const MarketPlace = () => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [mySwappableSlots, setMySwappableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const token = Cookies.get("token");

    const fetchAvailableSlots = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/swappable-slots`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log(data);

            setAvailableSlots(data);
        } catch (error) {
            console.error("Error fetching available slots:", error);
        }
    };

    // Fetch user's own SWAPPABLE slots
    const fetchMySwappableSlots = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/my-swappable-slots`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            console.log(data);
            setMySwappableSlots(data);
        } catch (error) {
            console.error("Error fetching my swappable slots:", error);
        }
    };



    useEffect(() => {
        fetchAvailableSlots();
    }, []);

    const handleRequestSwap = (slot) => {
        setSelectedSlot(slot);
        fetchMySwappableSlots();
        setModalOpen(true);
    };

    const handleSwapSubmit = async (mySlotId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/swap/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mySlotId,
                    receiverSlotId: selectedSlot._id,
                }),
            });

            const data = await res.json();
            if (data.success) {
                alert("Swap request sent successfully!");
                setModalOpen(false);
            } else {
                alert(data.message || "Failed to send swap request");
            }
        } catch (error) {
            console.error("Error sending swap request:", error);
            alert("Error sending swap request");
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen p-6" style={{ backgroundColor: colors.background }}>
            <Navbar />
            <Typography
                variant="h4"
                className="text-center mb-6"
                style={{ color: colors.textWhite, marginTop: "20px" }}
            >
                Marketplace - Swappable Slots
            </Typography>

            <TableContainer
                component={Paper}
                style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    marginTop: "20px"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: colors.background }}>
                            <TableCell style={{ color: colors.textWhite, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}` }}>
                                User Name
                            </TableCell>
                            <TableCell style={{ color: colors.textWhite, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}` }}>
                                Event Name
                            </TableCell>
                            <TableCell style={{ color: colors.textWhite, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}` }}>
                                From Time
                            </TableCell>
                            <TableCell style={{ color: colors.textWhite, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}` }}>
                                To Time
                            </TableCell>
                            <TableCell style={{ color: colors.textWhite, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}` }}>
                                Date
                            </TableCell>
                            <TableCell style={{ color: colors.textWhite, fontWeight: 'bold', borderBottom: `1px solid ${colors.border}` }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {availableSlots.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    style={{ color: colors.textLight, borderBottom: `1px solid ${colors.border}`, padding: '2rem' }}
                                >
                                    No swappable slots available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            availableSlots.map((slot) => (
                                <TableRow
                                    key={slot._id}
                                    style={{
                                        '&:hover': { backgroundColor: colors.background }
                                    }}
                                >
                                    <TableCell style={{ color: colors.textWhite, borderBottom: `1px solid ${colors.border}` }}>
                                        {slot.userId.name}
                                    </TableCell>
                                    <TableCell style={{ color: colors.textWhite, borderBottom: `1px solid ${colors.border}` }}>
                                        {slot.title}
                                    </TableCell>
                                    <TableCell style={{ color: colors.textLight, borderBottom: `1px solid ${colors.border}` }}>
                                        {formatTime(slot.startTime)}
                                    </TableCell>
                                    <TableCell style={{ color: colors.textLight, borderBottom: `1px solid ${colors.border}` }}>
                                        {formatTime(slot.endTime)}
                                    </TableCell>
                                    <TableCell style={{ color: colors.textLight, borderBottom: `1px solid ${colors.border}` }}>
                                        {formatDate(slot.startTime)}
                                    </TableCell>
                                    <TableCell style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleRequestSwap(slot)}
                                            style={{
                                                backgroundColor: colors.primary,
                                                color: colors.textWhite,
                                            }}
                                            onMouseOver={(e) => (e.target.style.backgroundColor = colors.primaryHover)}
                                            onMouseOut={(e) => (e.target.style.backgroundColor = colors.primary)}
                                        >
                                            Request Swap
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Swap Request Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    className="p-6 rounded-xl"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: colors.cardBg,
                        width: "90%",
                        maxWidth: "500px",
                        border: `2px solid ${colors.border}`,
                    }}
                >
                    <Typography variant="h6" style={{ color: colors.textWhite, marginBottom: "1rem" }}>
                        Choose one of your SWAPPABLE slots as your offer
                    </Typography>

                    {mySwappableSlots.length === 0 ? (
                        <Typography style={{ color: colors.textLight }}>
                            You have no swappable slots available.
                        </Typography>
                    ) : (
                        mySwappableSlots.map((slot) => (
                            <Box
                                key={slot._id}
                                className="p-3 mb-3 rounded-lg cursor-pointer hover:opacity-80"
                                style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}
                                onClick={() => handleSwapSubmit(slot._id)}
                            >
                                <Typography className="font-bold" style={{ color: colors.textWhite }}>
                                    {slot.title}
                                </Typography>
                                <Typography style={{ color: colors.textLight, fontSize: "0.9rem" }}>
                                    {slot.description || "No description"}
                                </Typography>
                                <Typography style={{ color: colors.textLight, fontSize: "0.8rem" }}>
                                    {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                                </Typography>
                            </Box>
                        ))
                    )}

                    <Button
                        variant="contained"
                        onClick={() => setModalOpen(false)}
                        style={{
                            backgroundColor: colors.primary,
                            color: colors.textWhite,
                            marginTop: "1rem",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = colors.primaryHover)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = colors.primary)}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default MarketPlace;