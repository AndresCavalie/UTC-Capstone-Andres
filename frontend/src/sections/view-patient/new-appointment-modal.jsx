import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes, faCircleMinus, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
    Box,
    Card,
    List,
    Modal,
    Paper,
    Avatar,
    Button,
    ListItem,
    CardMedia,
    IconButton,
    CardContent,
    CardActions,
    TextField,
} from '@mui/material';

import { primary } from 'src/theme/palette';

import MiniExerciseView from 'src/sections/workouts/mini-exercise-view';

import Cookies from 'js-cookie';
import { Link, useParams } from 'react-router-dom';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { VisuallyHiddenInput } from '@chakra-ui/react';

export default function NewAppointmentModal({resetState}) {
    const { id } = useParams();
    const handleFileUpload = (e) => {
        
        const file = e.target.files[0];
        setInsuranceCardImage(file);
    };
    const [date,setDate] = useState('')
    const [time,setTime] = useState('')
    const [formData, setFormData] = useState({
        reason: '',
        injury:'',
    });
    const handleChange = (e) => {
     
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
    };
    const handleClick = () => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        
        // Extract hours, minutes, and seconds from timeObject
        const hours = time.getHours();
        const minutes = time.getMinutes();
        
        // Create a new Date object by combining date and time components
        const combinedDateTime = new Date(year, month, day, hours, minutes, 0);
        const appointment = {...formData, AppointmentTime: combinedDateTime, PatientId:id}
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookieValue}` },
            body: JSON.stringify(appointment)
        };
        
        fetch('/api/appointments', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                resetState();
            });
    };
    return (
        <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',

                        transform: 'translate(-50%, -50%)',
                    }}
                >
                  
                        <Paper sx={{ p: 2, minWidth: '500px' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2} p={2}>
                        <Grid item xs={6}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker  onChange={(value) => setDate(value.$d)}
                                    size="small"
                                    label="Date"
                                />
                            </DemoContainer>
                        </Grid>
                        <Grid item xs={6}>
                            <DemoContainer components={['TimePicker']} >
                                <TimePicker sx={{}} label="Time"  onChange={(value) => setTime(value.$d)}/>
                            </DemoContainer>
                            {/* <TextField label="Time" type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required fullWidth /> */}
                        </Grid>
                        
                        <Grid item xs={6}>
                            <TextField
                                label="Reason"
                                name="reason"
                                onChange={handleChange}
                                
                                
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Injury"
                                name="injury"
                                onChange={handleChange}
                                
                                
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Signature"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Stack sx={{width:'100%'}} direction="row" justifyContent='flex-end'><Button onClick={() => handleClick()}>Submit</Button></Stack>
                        
                    </Grid>
                </LocalizationProvider>
                        </Paper>
                        
                    
                </Box>
    );
}
