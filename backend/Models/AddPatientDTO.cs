using System.ComponentModel.DataAnnotations;

namespace WebApiJobSearch.Models
{
   
    public class AddPatientDTO
    {
        //public string ProfilePicture { get; set; }
        public DateTime Birthdate { get; set; }
        public string? Injury { get; set; }
        public string? Gender { get; set; }
        [Required(ErrorMessage="Phone Number is Required.")] public string? PhoneNumber { get; set; }
        public string? MedicalHistoryNotes { get; set; }
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public int? ZipCode { get; set; }
        public string? Country { get; set; }
        public string Username { get; set; }
        public string? Password { get; set; }



    }
}
