import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import Navbar from '../components/Navbar';
import Cookies from "js-cookie";
import { Delete, Edit, Save, X } from 'lucide-react';
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const colors = {
  background: '#040D12',
  cardBg: '#183D3D',
  border: '#5C8374',
  textLight: '#93B1A6',
  textWhite: '#ffffff',
  primary: '#A27B5C',
  primaryHover: '#b58e70',
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    status: 'BUSY'
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setEditingEventId(null);
  };

  const handleEventInputChange = (field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setEditedEvent({
      title: event.title,
      description: event.description,
      startTime: dayjs(event.startTime).format('HH:mm'),
      endTime: dayjs(event.endTime).format('HH:mm'),
      status: event.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setEditedEvent({});
  };

  const handleEditInputChange = (field, value) => {
    setEditedEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteClick = async (eventId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/remove/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      const data = await response.json();
      toast.success("Deleted Event");

    } catch (error) {
      console.error("Error updating event:", error.message);
      toast.error(error.message);
    }
  }

  const handleUpdateEvent = async (eventId) => {
    const dateStr = selectedDate.format('YYYY-MM-DD');
    const startDateTime = new Date(`${dateStr}T${editedEvent.startTime}:00`);
    const endDateTime = new Date(`${dateStr}T${editedEvent.endTime}:00`);

    const eventData = {
      id: eventId,
      title: editedEvent.title,
      description: editedEvent.description,
      startTime: startDateTime,
      endTime: endDateTime,
      status: editedEvent.status,
    };

    try {
      const token = Cookies.get("token");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      console.log("Event updated:", data.data);
      toast.success("Event updated successfully!");

      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? data.data : event
        )
      );
      setEditingEventId(null);
      setEditedEvent({});
    } catch (error) {
      console.error("Error updating event:", error.message);
      toast.error(error.message);
    }
  };

  const handleCreateEvent = async () => {
    const dateStr = selectedDate.format('YYYY-MM-DD');

    const startDateTime = new Date(`${dateStr}T${newEvent.startTime}:00`);
    const endDateTime = new Date(`${dateStr}T${newEvent.endTime}:00`);

    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      startTime: startDateTime,
      endTime: endDateTime,
      status: newEvent.status,
    };

    try {
      const token = Cookies.get("token");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      console.log("Event created:", data.data);
      toast.success("Event created successfully!");

      setNewEvent({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        status: 'BUSY'
      });

      setEvents(prevEvents => [...prevEvents, data.data]);
    } catch (error) {
      console.error("Error creating event:", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getEventsForSelectedDate = async () => {
      try {
        const formattedDate = selectedDate.format("YYYY-MM-DD");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/by-date?date=${formattedDate}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const data = await res.json();
        console.log(data);
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    if (selectedDate) {
      getEventsForSelectedDate();
    }
  }, [selectedDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'BUSY': return '#d32f2f';
      case 'SWAPPABLE': return '#388e3c';
      case 'SWAP_PENDING': return '#f57c00';
      default: return colors.primary;
    }
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{
          display: 'flex',
          height: 'calc(100vh - 64px)',
          '& ::-webkit-scrollbar': {
            width: '10px',
          },
          '& ::-webkit-scrollbar-track': {
            backgroundColor: colors.background,
          },
          '& ::-webkit-scrollbar-thumb': {
            backgroundColor: colors.border,
            borderRadius: '5px',
            border: `2px solid ${colors.background}`,
          },
          '& ::-webkit-scrollbar-thumb:hover': {
            backgroundColor: colors.textLight,
          },
        }}>
          {/* Calendar Section - 30% */}
          <Box
            sx={{
              width: '30%',
              p: 3,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: colors.background,
            }}
          >
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                color: 'white',
                '& .MuiPickersCalendarHeader-root': {
                  color: 'white',
                },
                '& .MuiPickersCalendarHeader-label': {
                  color: 'white',
                },
                '& .MuiPickersArrowSwitcher-button': {
                  color: 'white',
                },
                '& .MuiDayCalendar-weekDayLabel': {
                  color: 'white',
                },
                '& .MuiPickersDay-root': {
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  },
                },
                '& .MuiPickersDay-today': {
                  border: '1px solid white',
                  color: 'white',
                },
              }}
            />
          </Box>

          {/* Events List Section - 40% */}
          <Box sx={{
            width: '40%',
            backgroundColor: colors.cardBg,
            borderLeft: `2px solid ${colors.border}`,
            overflowY: 'auto',
            p: 3
          }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: colors.textWhite, mb: 2 }}>
                {selectedDate ? `Events on ${selectedDate.format('MMMM D, YYYY')}` : 'Select a date'}
              </Typography>

              {selectedDate && events.length === 0 && (
                <Typography sx={{ color: colors.textLight, fontStyle: 'italic' }}>
                  No events scheduled for this date
                </Typography>
              )}

              {selectedDate && events.map(event => (
                <Card key={event.id} sx={{
                  mb: 2,
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`
                }}>
                  <CardContent>
                    {editingEventId === event.id ? (
                      <Box>
                        <TextField
                          fullWidth
                          label="Title"
                          value={editedEvent.title}
                          onChange={(e) => handleEditInputChange('title', e.target.value)}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              color: colors.textWhite,
                              '& fieldset': { borderColor: colors.border },
                              '&:hover fieldset': { borderColor: colors.textLight },
                              '&.Mui-focused fieldset': { borderColor: colors.primary },
                            },
                            '& .MuiInputLabel-root': { color: colors.textLight },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Description"
                          value={editedEvent.description}
                          onChange={(e) => handleEditInputChange('description', e.target.value)}
                          multiline
                          rows={2}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              color: colors.textWhite,
                              '& fieldset': { borderColor: colors.border },
                              '&:hover fieldset': { borderColor: colors.textLight },
                              '&.Mui-focused fieldset': { borderColor: colors.primary },
                            },
                            '& .MuiInputLabel-root': { color: colors.textLight },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Start Time"
                          type="time"
                          value={editedEvent.startTime}
                          onChange={(e) => handleEditInputChange('startTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              color: colors.textWhite,
                              '& fieldset': { borderColor: colors.border },
                              '&:hover fieldset': { borderColor: colors.textLight },
                              '&.Mui-focused fieldset': { borderColor: colors.primary },
                            },
                            '& .MuiInputLabel-root': { color: colors.textLight },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="End Time"
                          type="time"
                          value={editedEvent.endTime}
                          onChange={(e) => handleEditInputChange('endTime', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              color: colors.textWhite,
                              '& fieldset': { borderColor: colors.border },
                              '&:hover fieldset': { borderColor: colors.textLight },
                              '&.Mui-focused fieldset': { borderColor: colors.primary },
                            },
                            '& .MuiInputLabel-root': { color: colors.textLight },
                          }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel sx={{ color: colors.textLight }}>Status</InputLabel>
                          <Select
                            value={editedEvent.status}
                            onChange={(e) => handleEditInputChange('status', e.target.value)}
                            label="Status"
                            sx={{
                              color: colors.textWhite,
                              '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.textLight },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
                              '& .MuiSvgIcon-root': { color: colors.textLight },
                            }}
                          >
                            <MenuItem value="BUSY">Busy</MenuItem>
                            <MenuItem value="SWAPPABLE">Swappable</MenuItem>
                            <MenuItem value="SWAP_PENDING">Swap Pending</MenuItem>
                          </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<Save size={18} />}
                            onClick={() => handleUpdateEvent(event._id)}
                            sx={{
                              flex: 1,
                              backgroundColor: colors.primary,
                              '&:hover': { backgroundColor: colors.primaryHover },
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<X size={18} />}
                            onClick={handleCancelEdit}
                            sx={{
                              flex: 1,
                              borderColor: colors.border,
                              color: colors.textLight,
                              '&:hover': { borderColor: colors.textLight },
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="h6" sx={{ color: colors.textWhite }}>
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={event.status.replace('_', ' ')}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(event.status),
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(event)}
                              sx={{ color: colors.textLight, '&:hover': { color: colors.textWhite } }}
                            >
                              <Edit size={18} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(event._id)}
                              sx={{ color: colors.textLight, '&:hover': { color: colors.textWhite } }}
                            >
                              <X size={18} />
                            </IconButton>
                          </Box>
                        </Box>
                        {event.description && (
                          <Typography sx={{ color: colors.textLight, mb: 1 }}>
                            {event.description}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                          {dayjs(event.startTime).format('h:mm A')} - {dayjs(event.endTime).format('h:mm A')}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Create Event Section - 40% */}
          <Box sx={{
            width: '40%',
            backgroundColor: colors.cardBg,
            borderLeft: `2px solid ${colors.border}`,
            overflowY: 'auto',
            p: 3
          }}>
            <Box>
              <Typography variant="h6" sx={{ color: colors.textWhite, mb: 2 }}>
                Create New Event
              </Typography>

              <TextField
                fullWidth
                label="Title"
                value={newEvent.title}
                onChange={(e) => handleEventInputChange('title', e.target.value)}
                required
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: colors.textWhite,
                    '& fieldset': { borderColor: colors.border },
                    '&:hover fieldset': { borderColor: colors.textLight },
                    '&.Mui-focused fieldset': { borderColor: colors.primary },
                  },
                  '& .MuiInputLabel-root': { color: colors.textLight },
                }}
              />

              <TextField
                fullWidth
                label="Description"
                value={newEvent.description}
                onChange={(e) => handleEventInputChange('description', e.target.value)}
                multiline
                rows={2}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: colors.textWhite,
                    '& fieldset': { borderColor: colors.border },
                    '&:hover fieldset': { borderColor: colors.textLight },
                    '&.Mui-focused fieldset': { borderColor: colors.primary },
                  },
                  '& .MuiInputLabel-root': { color: colors.textLight },
                }}
              />

              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={newEvent.startTime}
                onChange={(e) => handleEventInputChange('startTime', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: colors.textWhite,
                    '& fieldset': { borderColor: colors.border },
                    '&:hover fieldset': { borderColor: colors.textLight },
                    '&.Mui-focused fieldset': { borderColor: colors.primary },
                  },
                  '& .MuiInputLabel-root': { color: colors.textLight },
                }}
              />

              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={newEvent.endTime}
                onChange={(e) => handleEventInputChange('endTime', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: colors.textWhite,
                    '& fieldset': { borderColor: colors.border },
                    '&:hover fieldset': { borderColor: colors.textLight },
                    '&.Mui-focused fieldset': { borderColor: colors.primary },
                  },
                  '& .MuiInputLabel-root': { color: colors.textLight },
                }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: colors.textLight }}>Status</InputLabel>
                <Select
                  value={newEvent.status}
                  onChange={(e) => handleEventInputChange('status', e.target.value)}
                  label="Status"
                  sx={{
                    color: colors.textWhite,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.textLight },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
                    '& .MuiSvgIcon-root': { color: colors.textLight },
                  }}
                >
                  <MenuItem value="BUSY">Busy</MenuItem>
                  <MenuItem value="SWAPPABLE">Swappable</MenuItem>
                  <MenuItem value="SWAP_PENDING">Swap Pending</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                onClick={() => handleCreateEvent(newEvent)}
                disabled={!selectedDate}
                sx={{
                  backgroundColor: colors.primary,
                  color: colors.textWhite,
                  '&:hover': {
                    backgroundColor: colors.primaryHover,
                  },
                  '&:disabled': {
                    backgroundColor: colors.border,
                    color: colors.textLight,
                  },
                }}
              >
                Create Event
              </Button>

              {!selectedDate && (
                <Typography variant="caption" sx={{ color: colors.textLight, display: 'block', mt: 1, textAlign: 'center' }}>
                  Please select a date first
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default Dashboard;