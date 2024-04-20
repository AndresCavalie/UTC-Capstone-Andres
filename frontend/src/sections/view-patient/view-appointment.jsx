import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes, faCircleMinus, faEdit, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

import { primary } from 'src/theme/palette';
import MiniExerciseView from '../workouts/mini-exercise-view';

export default function ViewAppointment({selectedAppointment,deleteAppointment}){
    const [noteContent, setNoteContent] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editedNotes, setEditedNotes] = useState({}); 
    const [openDialog, setOpenDialog] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [exercisesOpen, setexercisesOpen] = useState(false);

    return (
        <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',

                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        <Paper sx={{ p: 2, minHeight: '520px', minWidth: '800px' }}>
                            {Object.keys(selectedAppointment).length === 0 ? (
                                ''
                            ) : (
                                <>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="h5">
                                            {selectedAppointment.appointmentTime
                                                ?.toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                })
                                                .replace(/\//g, '-')}
                                        </Typography>
                                        <IconButton onClick={() => deleteAppointment(selectedAppointment.id)}>
                                            <FontAwesomeIcon icon={faTrash} size="xs" />
                                        </IconButton>
                                    </Stack>
                                   <Box mt={2}>
                                        <Box display="flex" alignItems="center">
                                            <Typography variant="h6">Notes from session</Typography>
                                        </Box>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                               <Card>
                                                    <CardContent style={{ backgroundColor: primary.lighter }}>
                                                    <List>
                                                        {selectedAppointment.notes.map((note, index) => (
                                                        <ListItem key={index}>
                                                            {editingNoteId === index ? (
                                                            <>
                                                                <TextField 
                                                                value={noteContent} 
                                                                onChange={(e) => {
                                                                    setNoteContent(e.target.value);
                                                                    if (e.target.value !== note.content) {
                                                                    setEditedNotes(prevState => ({...prevState, [index]: e.target.value}));
                                                                    }
                                                                }} 
                                                                />
                                                                {(editedNotes[index] && editedNotes[index] !== note.content) && (
                                                                <IconButton
                                                                    onClick={() => {
                                                                        // Function to save edited note goes here...
                                                                        selectedAppointment.notes[index].content = editedNotes[index];

                                                                        // Reset editing state
                                                                        setEditingNoteId(null);
                                                                        delete editedNotes[index];
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </IconButton>
                                                                )}
                                                            </>
                                                            ) : (
                                                            <>
                                                                {note.content}
                                                                <IconButton
                                                                onClick={() => {
                                                                    setEditingNoteId(index);
                                                                    setNoteContent(note.content);
                                                                }}
                                                                style={{ marginLeft: '10px' }}
                                                                >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                                </IconButton>
                                                            </>
                                                            )}
                                                        </ListItem>
                                                        ))}
                                                    </List>
                                                    </CardContent>
                                                </Card>
                                                {/* Add Note Button */}
                                                <Box mt={2}>  
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            setOpenDialog(true);
                                                        }}
                                                    >
                                                        Add Note
                                                    </Button>

                                                    {/* New Note Creation Dialog */}
                                                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                                        <DialogTitle>Create New Note</DialogTitle>
                                                        
                                                        <DialogContent>
                                                            <TextField 
                                                                value={newNote} 
                                                                onChange={(e) => setNewNote(e.target.value)} 
                                                                placeholder="Enter your note here..."
                                                            />
                                                        </DialogContent>

                                                        <DialogActions>
                                                            <Button onClick={() => setOpenDialog(false)}>
                                                            Cancel
                                                            </Button>

                                                            <Button 
                                                            onClick={() => {
                                                                // Function to add new note goes here..
                                                                
                                                                // Close the dialog and reset new note input field
                                                                setOpenDialog(false);
                                                                setNewNote("");
                                                            }}
                                                            >
                                                            Save Note
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </Box> 

                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Workouts */}
                                    <Box mt={4}>
                                        <Typography variant="h6">Exercises</Typography>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Card>
                                                    <CardContent
                                                        style={{ backgroundColor: primary.lighter }}
                                                    >
                                                        {selectedAppointment.exercises.map(
                                                            (ex, i) => (
                                                                <Stack spacing={1} pt={1}>
                                                                    <Stack
                                                                        direction="row"
                                                                        justifyContent="space-between"
                                                                        alignItems="center"
                                                                    >
                                                                        <Stack
                                                                            direction="row"
                                                                            alignItems="center"
                                                                            spacing={2}
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    width: '60px',
                                                                                    height: '60px',
                                                                                    display:
                                                                                        'inline',
                                                                                    boxShadow:
                                                                                        '0px 1px 5px 2px lightgrey',
                                                                                    borderRadius:
                                                                                        '10px',
                                                                                    p: 0.7,
                                                                                }}
                                                                            >
                                                                                <Box
                                                                                    component="img"
                                                                                    alt={
                                                                                        ex.getRiteExerciseId
                                                                                    }
                                                                                    src={`/assets/images/exercises/exercise_${getRiteExerciseId+1}.jpg`}
                                                                                    sx={{
                                                                                        objectFit:
                                                                                            'cover',
                                                                                        display:
                                                                                            'inline',
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                            <Typography
                                                                                sx={{
                                                                                    display:
                                                                                        'inline',
                                                                                }}
                                                                                variant="body1"
                                                                            >
                                                                                {ex.name}
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Box>
                                                                            <IconButton>
                                                                                <FontAwesomeIcon
                                                                                    icon={
                                                                                        faCircleMinus
                                                                                    }
                                                                                    size="xs"
                                                                                />
                                                                            </IconButton>
                                                                        </Box>
                                                                    </Stack>
                                                                </Stack>
                                                            )
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        <Stack direction="row" spacing={2} mt={2}>
                                           <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setexercisesOpen(!exercisesOpen);
                                            }}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {}}
                                        >
                                            Filter
                                        </Button>                                         
                                        </Stack>
                                    </Box>
                                </>
                            )}
                        </Paper>
                        <Paper
                            sx={{
                                p: 2,
                                height: '475px',
                                display: exercisesOpen ? 'block' : 'none',
                            }}
                        >
                            <Stack sx={{ width: 350 }}>
                                <MiniExerciseView sx={{ minHeight: 0 }} />
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
    )
}