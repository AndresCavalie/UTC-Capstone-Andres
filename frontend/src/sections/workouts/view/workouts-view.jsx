import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Modal, Paper, Button } from '@mui/material';
import { TextField } from '@mui/material';

import { posts } from 'src/_mock/blog';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';
import ExerciseItem from '../exercise-item';
import MiniExerciseView from '../mini-exercise-view';
import Cookies from 'js-cookie';
// ----------------------------------------------------------------------

export default function WorkoutsView() {
        const [open, setOpen] = useState(false);
        const [selectedWorkout, setSelectedWorkout] = useState({});
        const [openNewWorkoutModal, setOpenNewWorkoutModal] = useState(false);
        const [newWorkout, setNewWorkout] = useState({ name: '', exercises: [] });
        const [Workouts, setWorkouts] = useState([]);
        const [searchValue, setSearchValue] = useState('');
        const [bodyPartValue, setbodyPartValue] = useState('All Body Parts');
        const [bodyParts, setBodyParts] = useState([]);

        const handleAddNewWorkout = () => {
            setOpenNewWorkoutModal(true);
        };
    
        const handleSaveNewWorkout = () => {
            // Logic to save the new workout 
            setOpenNewWorkoutModal(false);
        };
    
        const handleAddExerciseToNewWorkout = (exercise) => {
            setNewWorkout({ ...newWorkout, exercises: [...newWorkout.exercises, exercise] });
        };
    
        const handleRemoveExerciseFromNewWorkout = (exerciseId) => {
            setNewWorkout({
                ...newWorkout,
                exercises: newWorkout.exercises.filter((exercise) => exercise.id !== exerciseId),
            });
        };

    function handleRemoveExercise(Eid){
        console.log(Eid)
        console.log(selectedWorkout.id)
        removeExercise(selectedWorkout.id,Eid)
        
  
        //call to populate the selectedWorkoutagain
    }

    function handleAddExercise(Eid){
        console.log(Eid)
        console.log(selectedWorkout.id)
        addExercise(selectedWorkout.id,Eid)
        
  
        //call to populate the selectedWorkoutagain
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function openDialog(id) {
        getWorkoutById(id);
        setOpen(true);
        // console.log(selectedWorkout)
    }

    function getWorkouts() {
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${cookieValue}` },
        };
        fetch(`/api/workouts?description=${searchValue}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setWorkouts(data);
            });
    }

    function removeExercise(Wid,Eid) {
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${cookieValue}` },
        };
        fetch(`/api/workouts/${Wid}/exercise/${Eid}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                getWorkoutById(selectedWorkout.id);
                getWorkouts();
            });
    }

    function addExercise(Wid,Eid) {
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'POST',
            headers: { Authorization: `Bearer ${cookieValue}` },
        };
        fetch(`/api/workouts/${Wid}/exercise/${Eid}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                getWorkoutById(selectedWorkout.id);
                getWorkouts();
            });
    }
    

    const [availableExercises, setAvailableExercises] = useState([]);

    function fetchAvailableExercises() {
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${cookieValue}` },
        };
        fetch(`/api/exercises`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setAvailableExercises(data);
            });
    }
    
    useEffect(() => {
        fetchAvailableExercises();
    }, []);

    function getWorkoutById(id) {
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${cookieValue}` },
        };
        fetch(`/api/workouts/${id}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setSelectedWorkout(data[0]);
          
            });
    }

    useEffect(() => {
        getWorkouts();
    }, [searchValue, bodyPartValue]);

    return (
        <>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4">Workouts</Typography>
                    <Button variant="contained" onClick={handleAddNewWorkout}>Add New Workout</Button>
                </Stack>

                <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
                    <PostSearch posts={Workouts} setSearchValue={setSearchValue} />
                    {/* <PostSort
                        options={[
                            { value: 'latest', label: 'Latest' },
                            { value: 'popular', label: 'Popular' },
                            { value: 'oldest', label: 'Oldest' },
                        ]}
                    /> */}
                </Stack>

                <Grid container spacing={3}>
                    {Workouts.map((post, index) => (
                        <PostCard key={post.id} post={post} dialogFunction={openDialog} />
                    ))}
                </Grid>
            </Container>

            <Modal open={openNewWorkoutModal} onClose={() => setOpenNewWorkoutModal(false)}>
    <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }}
    >
        <Stack direction="row" spacing={2}>
            {/* New Workout Section */}
            <Paper sx={{ p: 2, height: '475px' }}>
                <TextField
                    label="Workout Name"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                />

<Typography variant="h4">
                {selectedWorkout.description}
                    </Typography>
                    <Stack sx={{ width: 500 }} mt={2}>
                    {newWorkout.exercises.map((ex, i) => (
                /* { <Typography variant="h5">Exercises</Typography>
                <Stack sx={{ width: 500 }} mt={2}>
                    {newWorkout.exercises.map((ex, i) => ( } */
                        <ExerciseItem
                                                key={ex.id}
                                                post={{
                                                    name: ex.name,
                                                    id: ex.id,
                                                    cover: '/assets/images/exercises/exercise_16.jpg',
                                                }}
                            isExpanded={selectedWorkout.isDefault ? false: true}
                            onRemoveExercise={() => handleRemoveExerciseFromNewWorkout(ex.id)}
                        />
                    ))} 

                    <Stack pt={2}>
                        <Button
                            variant="outlined"
                            sx={{ justifyContent: 'left' }}
                        >
                            + Add Exercise
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* Available Exercises Section */}
            <Paper sx={{ p: 2, height: '475px' }}>
                <Stack sx={{ width: 350 }}>
                    <MiniExerciseView sx={{ minHeight: 0 }} handleAddExercise={handleAddExerciseToNewWorkout} />
                </Stack>
            </Paper>
        </Stack>
    </Box>
</Modal>

<Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',

                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        <Paper sx={{ p: 2, height: '475px' }}>
                            {Object.keys(selectedWorkout).length === 0 ? (
                                ''
                            ) : (
                                <>
                                    <Typography variant="h4">
                                        {selectedWorkout.description}
                                    </Typography>
                                    <Stack sx={{ width: 500 }} mt={2}>
                                        {selectedWorkout.exercises.map((ex, i) => (
                                            <ExerciseItem
                                                key={ex.id}
                                                post={{
                                                    name: ex.name,
                                                    id: ex.id,
                                                    cover: '/assets/images/exercises/exercise_16.jpg',
                                                }}
                                                isExpanded={selectedWorkout.isDefault ? false: true}
                                                onRemoveExercise = {handleRemoveExercise}
                                            />
                                        ))}

                                        <Stack pt={2}>
                                            <Button
                                                variant="outlined"
                                                sx={{ justifyContent: 'left' }}
                                            >
                                                + Add Exercise
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </>
                            )}
                        </Paper>
                        <Paper sx={{ p: 2, height: '475px' }}>
                            <Stack sx={{ width: 350 }}>
                                <MiniExerciseView sx={{ minHeight: 0 }} handleAddExercise={handleAddExercise} />
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Modal>
            {/* <Dialog
    open={open}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
    scroll='paper'
    maxWidth='xl'
    PaperProps={{}}
  
>		
  <DialogTitle>Workout 1</DialogTitle>
  <DialogContent>

<Stack sx={{width:500}}>
 <ExerciseItem post={{title:'plank',cover:'/assets/images/exercises/exercise_16.jpg'}}/>
 <ExerciseItem post={{title:'plank',cover:'/assets/images/exercises/exercise_16.jpg'}}/>
 <ExerciseItem post={{title:'plank',cover:'/assets/images/exercises/exercise_16.jpg'}}/>
 <ExerciseItem post={{title:'plank',cover:'/assets/images/exercises/exercise_16.jpg'}}/>
 <ExerciseItem post={{title:'plank',cover:'/assets/images/exercises/exercise_16.jpg'}}/>
 <Stack  pt={2}>
				<Button variant="outlined" sx={{justifyContent:'left'}}>+ Add Exercise</Button>	
		  </Stack>
</Stack>
  </DialogContent>  
</Dialog> */}
        </>
    );
}