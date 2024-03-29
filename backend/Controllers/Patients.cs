using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using WebApiJobSearch.Models;

namespace WebApiJobSearch.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class Patients : ControllerBase
    {
        private readonly TodoContext _context;
        public Patients(TodoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index(
            [FromQuery] string? name,
            [FromQuery] string? bodypart)
        {
            var officeId = 3;



            var patientsQ = _context.GetRitePatients.Select(x => new { 
                    id = x.Id,
                    injury = x.Injury,
                    birthdate = x.Birthdate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    phone = x.PhoneNumber,
                    name = x.User.FirstName + " " +  x.User.LastName
                })
                .ToList();

            return Ok(patientsQ);
        }

        [HttpPost]
        public IActionResult newPatient(AddPatientDTO NewPatientInfo)

        {
            Console.WriteLine(NewPatientInfo);
            //var user = GetCurrentUser();

            State StateValue = (State)Enum.Parse(typeof(State), NewPatientInfo.State);
            Country CountryValue = (Country)Enum.Parse(typeof(Country), NewPatientInfo.Country);
            var newAddress = new GetRiteAddress {
                Address = NewPatientInfo.Address,
                State = StateValue,
                City = NewPatientInfo.City,
                ZipCode = NewPatientInfo.ZipCode,
                Country = CountryValue,
            };

            Gender GenderValue = (Gender)Enum.Parse(typeof(Gender), NewPatientInfo.Gender);
            var newPatient = new GetRitePatient {
                Birthdate = NewPatientInfo.Birthdate,
                Injury = NewPatientInfo.Injury,
                Gender = GenderValue,
                PhoneNumber = NewPatientInfo.PhoneNumber,
                MedicalHistoryNotes = NewPatientInfo.MedicalHistoryNotes
            };
            
            var newUser = new GetRiteUser {
                FirstName = NewPatientInfo.FirstName,
                LastName = NewPatientInfo.LastName,
                Email = NewPatientInfo.Email
            };
            
            newPatient.Address = newAddress;
            newUser.GetRitePatient = newPatient;
            _context.GetRiteUsers.Add(newUser);
            _context.SaveChanges();
            //var NewAppointment = new GetRiteAppointment
            //{
            //    AppointmentTime = appointment.AppointmentTime,
            //    Reason = appointment.Reason,
            //    Injury = appointment.Injury,
            //    OfficeId = int.Parse(user.OfficeId),
            //    PatientId = appointment.PatientId,


            //};
            //_context.GetRiteAppointments.Add(NewAppointment);
            //_context.SaveChanges();

            return Ok(new { response="good"});
        }

        [HttpGet("{id}")]
        public IActionResult Index(int id)
        {
            var officeId = 3;

            Type genderType = typeof(Gender);
            Type stateType = typeof(State);

            Func<Type, object, string> getNameDelegate = Enum.GetName;
            var patientsQ = _context.GetRitePatients
                .Where(x => x.Id == id)
                .Select(x => new {
                    id = x.Id,
                    injury = x.Injury,
                    birthdate = x.Birthdate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    phone = x.PhoneNumber,
                    firstName = x.User.FirstName,
                    lastName = x.User.LastName,
                    user = x.User,
                    gender = getNameDelegate(genderType, x.Gender),
                    address = x.Address,
                    state = getNameDelegate(stateType,x.Address.State)
                })
                
                .ToList();



            return Ok(patientsQ);
        }

 
    }
}
