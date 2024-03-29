import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import Cookies from 'js-cookie';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete } from '@mui/material';

export default function PatientsView() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showForm, setShowForm] = useState(false); // Add state to manage form visibility
    const [patients, setPatients] = useState([]);
    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = patients.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleNewPatientClick = () => {
        setShowForm(true); // Show the form when the button is clicked
    };

    const handleFormComplete = () => {
        setShowForm(false); // Hide the form when completed
        // Additional logic if needed
    };

    const dataFiltered = applyFilter({
        inputData: patients,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    function getPatients() {
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${cookieValue}` },
        };
        fetch(`/api/patients`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((patient) => {
                    const dateObj = new Date(patient.birthdate);
                    patient.birthdate = dateObj;
                });
                setPatients(data);
            });
    }

    useEffect(() => {
        getPatients();
    }, []);
    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container>
            {showForm ? (
                <PatientForm onComplete={handleFormComplete} />
            ) : (
                <>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={5}
                    >
                        <Typography variant="h4">Patients</Typography>
                        <Button
                            variant="contained"
                            color="inherit"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            onClick={handleNewPatientClick} // Attach click handler to show the form
                        >
                            New Patient
                        </Button>
                    </Stack>

                    <Card>
                        <UserTableToolbar
                            numSelected={selected.length}
                            filterName={filterName}
                            onFilterName={handleFilterByName}
                        />

                        <Scrollbar>
                            <TableContainer sx={{ overflow: 'unset' }}>
                                <Table sx={{ minWidth: 800 }}>
                                    <UserTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        rowCount={patients.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleSort}
                                        onSelectAllClick={handleSelectAllClick}
                                        headLabel={[
                                            { id: 'name', label: 'Name' },
                                            { id: 'injury', label: 'Injury' },
                                            { id: 'phone', label: 'Phone' },
                                            { id: 'birthdate', label: 'Birthdate' },
                                            { id: 'status', label: 'Status' },
                                            { id: '' },
                                        ]}
                                    />
                                    <TableBody>
                                        {dataFiltered
                                            .slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                            )
                                            .map((row) => (
                                                <UserTableRow
                                                    key={row.id}
                                                    id={row.id}
                                                    injury={row.injury}
                                                    birthdate={row.birthdate}
                                                    phone={row.phone}
                                                    name={row.name}
                                                    role="null"
                                                    status="null"
                                                    company="null"
                                                    avatarUrl={row.avatarUrl}
                                                    isVerified="null"
                                                    selected={selected.indexOf(row.name) !== -1}
                                                    handleClick={(event) =>
                                                        handleClick(event, row.name)
                                                    }
                                                />
                                            ))}

                                        <TableEmptyRows
                                            height={77}
                                            emptyRows={emptyRows(
                                                page,
                                                rowsPerPage,
                                                patients.length
                                            )}
                                        />

                                        {notFound && <TableNoData query={filterName} />}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>

                        <TablePagination
                            page={page}
                            component="div"
                            count={patients.length}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Card>
                </>
            )}
        </Container>
    );
}

function PatientForm({ onComplete }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [injury, setInjury] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [workPhone, setWorkPhone] = useState('');
    const [birthdate, SetBirthdate] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [newPatientForm, setNewPatientForm] = useState({
        FirstName:'',
        LastName: '',
        Birthdate:'',
        Email: '',
        Injury:'',
        Gender:'',
        PhoneNumber:'',
        Address: '',
        State: '',
        City: '',
        ZipCode: '',
        Country: '',
        MedicalHistoryNotes:'',
        Username:'',
        Password:'',
    })

    const states = [
        'AL', // Alabama
        'AK', // Alaska
        'AZ', // Arizona
        'AR', // Arkansas
        'CA', // California
        'CO', // Colorado
        'CT', // Connecticut
        'DE', // Delaware
        'FL', // Florida
        'GA', // Georgia
        'HI', // Hawaii
        'ID', // Idaho
        'IL', // Illinois
        'IN', // Indiana
        'IA', // Iowa
        'KS', // Kansas
        'KY', // Kentucky
        'LA', // Louisiana
        'ME', // Maine
        'MD', // Maryland
        'MA', // Massachusetts
        'MI', // Michigan
        'MN', // Minnesota
        'MS', // Mississippi
        'MO', // Missouri
        'MT', // Montana
        'NE', // Nebraska
        'NV', // Nevada
        'NH', // New Hampshire
        'NJ', // New Jersey
        'NM', // New Mexico
        'NY', // New York
        'NC', // North Carolina
        'ND', // North Dakota
        'OH', // Ohio
        'OK', // Oklahoma
        'OR', // Oregon
        'PA', // Pennsylvania
        'RI', // Rhode Island
        'SC', // South Carolina
        'SD', // South Dakota
        'TN', // Tennessee
        'TX', // Texas
        'UT', // Utah
        'VT', // Vermont
        'VA', // Virginia
        'WA', // Washington
        'WV', // West Virginia
        'WI', // Wisconsin
        'WY', // Wyoming
        'OTHER',
    ];

    const handleClickSubmit = () => {
        console.log(newPatientForm);
        const NewPatientInfo = newPatientForm
        const cookieValue = Cookies.get('JwtToken');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookieValue}` },
            body: JSON.stringify(NewPatientInfo)
        };
        
        fetch('/api/patients', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

            });
        onComplete();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Additional form submission logic
        onComplete(); // Call the completion callback when the form is submitted
    };

    PatientForm.propTypes = {
        onComplete: PropTypes.func.isRequired,
    };

    return (
        <Container>
            <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:arrow-back-fill" />}
                    onClick={() => onComplete()}
                >
                    Complete
                </Button>
            <h1>New Patient Form</h1>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.FirstName}
                    onChange={(e) => setNewPatientForm({...newPatientForm, FirstName: e.target.value})}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.LastName}
                    onChange={(e) => setNewPatientForm({...newPatientForm, LastName: e.target.value})}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            size="small"
                            label="Birthday"
                            onChange={(value) => setNewPatientForm({...newPatientForm, Birthdate: value.$d})}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.Email}
                    onChange={(e) => setNewPatientForm({...newPatientForm, Email: e.target.value})}
                />
                <TextField
                    label="Injury"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.Injury}
                    onChange={(e) => setNewPatientForm({...newPatientForm, Injury: e.target.value})}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select
                        value={newPatientForm.Gender}
                        onChange={(e) => setNewPatientForm({...newPatientForm, Gender: e.target.value})}
                        label="Gender"
                    >
                        <MenuItem value="M">Male</MenuItem>
                        <MenuItem value="F">Female</MenuItem>
                        <MenuItem value="X">Other</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.PhoneNumber}
                    onChange={(e) => setNewPatientForm({...newPatientForm, PhoneNumber: e.target.value})}
                />
                <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.Address}
                    onChange={(e) => setNewPatientForm({...newPatientForm, Address: e.target.value})}
                />
                <TextField
                    label="City"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.City}
                    onChange={(e) => setNewPatientForm({...newPatientForm, City: e.target.value})}
                />
                <TextField
                    label="Postal Code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.ZipCode}
                    onChange={(e) => setNewPatientForm({...newPatientForm, ZipCode: e.target.value})}
                />
                <Autocomplete
                    value={newPatientForm.State}
                    onChange={(event, newValue) => {
                        setNewPatientForm({...newPatientForm, State: newValue})
                      }}
                    options={states}
                    renderInput={(params) => <TextField {...params} label="State" />}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Country</InputLabel>
                    <Select
                        value={newPatientForm.Country}
                        onChange={(e) => setNewPatientForm({...newPatientForm, Country: e.target.value})}
                        label="Country"
                    >
                        <MenuItem value="USA">USA</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>
               
                <TextField
                    label="Medical History"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={newPatientForm.MedicalHistoryNotes}
                    onChange={(e) => setNewPatientForm({...newPatientForm, MedicalHistoryNotes: e.target.value})}
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.Username}
                    onChange={(e) => setNewPatientForm({...newPatientForm, Username: e.target.value})}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newPatientForm.Password}
                    onChange={(e) => setNewPatientForm({...newPatientForm, Password: e.target.value})}
                />
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    type="submit"
                    onClick={() => handleClickSubmit()}
                >
                    Complete
                </Button>

        </Container>
    );
}
