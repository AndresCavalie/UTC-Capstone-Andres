import { faEllipsis, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, IconButton, MenuItem, Popover, Stack, Typography, Modal, TextField} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';

export default function ReadPatientView({ setEditState, officeInfo }) {
    const [open, setOpen] = useState(null);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    
    return (
        <>
        <Modal
    open={isModalOpen}
    onClose={handleCloseModal}
    aria-labelledby="invite-physician-modal"
    aria-describedby="invite-physician-modal-description"
>
    <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    }}>
        <Typography id="invite-physician-modal" variant="h6" component="h2">
            Invite Physician
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Set User Name"
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Set Password"
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleCloseModal}>
                Send Invitation
            </Button>
        </Box>
    </Box>
</Modal>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Physicians</Typography>
                <Button onClick={handleOpenModal} sx={{ p: '1px', px: 1 }}>Invite Physician</Button>
            </Stack>
            <Stack spacing={1} mt={2}>
                {officeInfo.physicians.map((phys, i) => (
                    <Stack
                        direction="row"
                        sx={{ backgroundColor: '#F5F5F5', borderRadius: '10px', p: 1 }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="subtitle1">{phys.name}</Typography>
                        <IconButton onClick={handleOpenMenu}>
                            <Box
                                sx={{
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    m: '-5px',
                                }}
                            >
                                <FontAwesomeIcon icon={faEllipsisVertical} size="xs" />
                            </Box>
                        </IconButton>
                        <Popover
                            open={!!open}
                            anchorEl={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{
                                sx: { width: 140 },
                            }}
                        >
                            <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>

                            <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                                Delete
                            </MenuItem>
                        </Popover>
                    </Stack>
                ))}
            </Stack>
        </>
    );
}
