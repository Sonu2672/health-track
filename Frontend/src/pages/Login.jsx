import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";

function Login({ setIslogin, setIsadmin }) {
  const navigate = useNavigate();

  const [log, setlog] = useState(true);
  const [role, setRole] = useState("patient");

  const [doctorRegister, setDoctorRegister] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [show, setShow] = useState(false);

  // Doctor UI fields
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  


  const [doctorReg,setdoctorReg]=useState({
    firstname,
    lastname,
    email,
    password,
    phone,
    qualification,
    specialization,
    experience
  })



 // ================= LOGIN =================

  const Registersub = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://health-track-2b.onrender.com/api/doctors/doctorReg",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstname:doctorReg.firstname,
            lastname:doctorReg.lastname,
            email:doctorReg.email,
            password:doctorReg.password,
            phone:doctorReg.phone,
            qualification:doctorReg.qualification,
            specialization:doctorReg.specialization,
            experience:doctorReg.experience
          }),
        }
      );

      const data = await response.json();

      console.log(data.message);
      setdoctorReg({
    firstname,
    lastname,
    email,
    password,
    phone,
    qualification,
    specialization,
    experience
      });
      setRequestSent(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }

     
  }






  

  // ================= LOGIN =================

  const loginhandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://health-track-2b.onrender.com/api/users/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role
          }),
        }
      );

      const data = await response.json();

      console.log(data.message);
   if (data.success) {
  if (data.role === "admin") {
    setIslogin(true);
    navigate("/admindash");
  } 
  else if (data.role === "doctor") {
    setIslogin(true);
    navigate("/doctordash");
  } 
  else if (data.role === "patient") 
  {
    setIslogin(true);
    navigate("/dashboard");
  }

 
}
 else
  {
     navigate("/register");
  }


    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // ================= PATIENT SIGNUP =================

  const signuphandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://health-track-2b.onrender.com/api/users/signup",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            role
          }),
        }
      );

      const data = await response.json();

      console.log(
        "SIGNUP RESPONSE:",
        response.status,
        data
      );

      if (response.ok) {
        toast.success("Signup Successful 🚀");

        setfirstname("");
        setlastname("");
        setemail("");
        setpassword("");

        setlog(true);

        return;
      }

      toast.error(data.message || "Signup failed");
    } catch (error) {
      console.error("Signup Error:", error);

      toast.error(
        "Something went wrong during signup"
      );
    }
  };

  // ================= DOCTOR REGISTER =================

  const doctorRegisterHandler = (e) => {
    e.preventDefault();

    // UI prototype only
    setRequestSent(true);
  };

  // ================= REQUEST SENT =================

  if (requestSent) {
    return (
      <div className="health-auth-page">

        <div className="auth-card request-card">

          <button
            className="back-btn"
            onClick={() => {
              setRequestSent(false);
              setDoctorRegister(false);
            }}
          >
            ←
          </button>

          <div className="brand">
            <div className="brand-logo">
              ♥
            </div>

            <div>
              <h2>HealthTrack</h2>
              <p>Your Health • Our Priority</p>
            </div>
          </div>

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Registration Request Sent!
          </h1>

          <p className="request-text">
            Your doctor registration request has been
            successfully submitted. It will be reviewed
            by our admin team. You will be notified
            once it is approved.
          </p>

          <div className="review-box">

            <span>◷</span>

            <div>
              <strong>
                Estimated Review Time
              </strong>

              <p>
                Within 24–48 hours
              </p>
            </div>

          </div>

          <button
            className="auth-btn"
            onClick={() => {
              setRequestSent(false);
              setDoctorRegister(false);
              setRole("doctor");
              setlog(true);
            }}
          >
            Back to Login
          </button>

        </div>

      </div>
    );
  }

  // ================= DOCTOR REGISTRATION =================

  if (
    role === "doctor" &&
    doctorRegister
  ) {
    return (
      <div className="health-auth-page">

        <div className="auth-card doctor-register-card">

          <button
            className="back-btn"
            onClick={() =>
              setDoctorRegister(false)
            }
          >
            ←
          </button>

          <div className="brand">

            <div className="brand-logo">
              ♥
            </div>

            <div>
              <h2>HealthTrack</h2>
              <p>
                Your Health • Our Priority
              </p>
            </div>

          </div>

          <h1>
            Doctor Registration
          </h1>

          <p className="subtitle">
            Please fill in your professional details
          </p>

          <form
            className="auth-form"
            onSubmit={doctorRegisterHandler}
          >

            <div className="two-inputs">

              <input
                type="text"
                placeholder="First Name"
                value={doctorReg.firstname}
                onChange={(e) =>
                  setdoctorReg(prev => ({ ...prev, firstname: e.target.value }))
                }
                required
              />

              <input
                type="text"
                placeholder="Last Name"
                value={doctorReg.lastname}
                onChange={(e) =>
                    setdoctorReg(prev => ({ ...prev, lastname: e.target.value }))
                }
                required
              />

            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={doctorReg.email}
              onChange={(e) =>
                setdoctorReg(prev => ({ ...prev, email: e.target.value }))
              }
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={doctorReg.phone}
              onChange={(e) =>
                  setdoctorReg(prev => ({ ...prev, phone: e.target.value }))
              }
              required
            />

            <div className="pwd-box">

              <input
                type={
                  show
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={doctorReg.password}
                onChange={(e) =>
                   setdoctorReg(prev => ({ ...prev, password: e.target.value }))
                }
                required
              />

              <span
                className="eye"
                onClick={() =>
                  setShow(!show)
                }
              >
                {show ? "◉" : "◌"}
              </span>

            </div>

            <select
              value={doctorReg.qualification}
              onChange={(e) =>
                setdoctorReg(prev => ({ ...prev, qualification: e.target.value }))
              }
              required
            >
              <option value="">
                Select Qualification
              </option>

              <option>MBBS</option>
              <option>MD</option>
              <option>MS</option>
              <option>BDS</option>
              <option>Other</option>
            </select>

            <select
              value={doctorReg.specialization}
              onChange={(e) =>
                 setdoctorReg(prev => ({ ...prev, specialization: e.target.value }))
              }
              required
            >
              <option value="">
                Select Specialization
              </option>

              <option>
                General Physician
              </option>

              <option>
                Cardiologist
              </option>

              <option>
                Neurologist
              </option>

              <option>
                Orthopedic
              </option>

              <option>
                Dermatologist
              </option>
            </select>

            <input
              type="text"
              placeholder="Experience (in years)"
              value={doctorReg.experience}
              onChange={(e) =>
           setdoctorReg(prev => ({ ...prev,experience : e.target.value }))
              }
            />

            <div className="upload-title">
              Upload Documents

              <span>
                PDF / Image • Max 5MB each
              </span>
            </div>

            <div className="document-grid">

              <label className="document-box">

                <div>↑</div>

                <span>
                  Degree Certificate
                </span>

                <small>
                  Required
                </small>

                <input
                  type="file"
                  hidden
                />

              </label>

              <label className="document-box">

                <div>↑</div>

                <span>
                  Medical Council Registration
                </span>

                <small>
                  Required
                </small>

                <input
                  type="file"
                  hidden
                />

              </label>

              <label className="document-box">

                <div>↑</div>

                <span>
                  Experience Certificate
                </span>

                <small>
                  Optional
                </small>

                <input
                  type="file"
                  hidden
                />

              </label>

            </div>

            <button onClick={Registersub}
              type="submit"
              className="auth-btn"
            >
              Register
            </button>

          </form>

        </div>

      </div>
    );
  }

  // ================= LOGIN / SIGNUP =================

  return (
    <div className="health-auth-page">

      <div className="auth-card">

        <button
          className="back-btn"
          onClick={() =>
            navigate(-1)
          }
        >
          ←
        </button>

        {/* BRAND */}

        <div className="brand">

          <div className="brand-logo">
            ♥
          </div>

          <div>
            <h2>HealthTrack</h2>

            <p>
              Your Health • Our Priority
            </p>
          </div>

        </div>

        {/* HEADING */}

        <h1>
          {log
            ? `${role === "patient"
              ? "Patient"
              : role === "doctor"
                ? "Doctor"
                : "Admin"} Login`
            : "Create Account"}
        </h1>

        <p className="subtitle">

          {log
            ? "Welcome back! Please login to continue"
            : "Create your patient account"}

        </p>

        {/* ROLE SELECTOR */}

        {log && (

          <div className="role-selector">

            {/* PATIENT */}

            <button
              type="button"
              className={`role-btn ${
                role === "patient"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setRole("patient")
              }
            >

              <span className="role-icon">
                ●
              </span>

              <div>
                <strong>
                  Patient
                </strong>

                <small>
                  Track your health,
                  appointments and more
                </small>
              </div>

            </button>

            {/* DOCTOR */}

            <button
              type="button"
              className={`role-btn ${
                role === "doctor"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setRole("doctor")
              }
            >

              <span className="role-icon">
                ♙
              </span>

              <div>
                <strong>
                  Doctor
                </strong>

                <small>
                  Manage your patients
                </small>
              </div>

            </button>

            {/* ADMIN */}

            <button
              type="button"
              className={`role-btn ${
                role === "admin"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setRole("admin")
              }
            >

              <span className="role-icon">
                ⚙
              </span>

              <div>
                <strong>
                  Admin
                </strong>

                <small>
                  Manage HealthTrack
                </small>
              </div>

            </button>

          </div>
        )}


        

        {/* FORM */}

        <form
          onSubmit={
            log
              ? loginhandler
              : signuphandler
          }
          className="auth-form"
        >

          {/* PATIENT SIGNUP */}

          {!log && (

            <div className="two-inputs">

              <input
                type="text"
                value={firstname}
                placeholder="First Name"
                onChange={(e) =>
                  setfirstname(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="text"
                value={lastname}
                placeholder="Last Name"
                onChange={(e) =>
                  setlastname(
                    e.target.value
                  )
                }
                required
              />

            </div>

          )}

          {/* EMAIL */}

          <input
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) =>
              setemail(e.target.value)
            }
            required
          />

          {/* PASSWORD */}

          <div className="pwd-box">

            <input
              type={
                show
                  ? "text"
                  : "password"
              }
              value={password}
              placeholder="Password"
              onChange={(e) =>
                setpassword(
                  e.target.value
                )
              }
              required
            />

            <span
              className="eye"
              onClick={() =>
                setShow(!show)
              }
            >
              {show ? "◉" : "◌"}
            </span>

          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            {log
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        {/* FOOTER */}

        <p className="auth-footer">

          {log ? (
            <>
              Don't have an account?{" "}

              {role === "patient" && (
                <span
                  onClick={() =>
                    setlog(false)
                  }
                >
                  Register as Patient
                </span>
              )}

              {role === "doctor" && (
                <span
                  onClick={() =>
                    setDoctorRegister(true)
                  }
                >
                  Register as Doctor
                </span>
              )}

              {role === "admin" && (
                <span className="admin-note">
                  Admin access is restricted
                </span>
              )}

            </>
          ) : (
            <>
              Already have an account?{" "}

              <span
                onClick={() =>
                  setlog(true)
                }
              >
                Login
              </span>
            </>
          )}

        </p>

        {/* BOTTOM */}

        <div className="doctor-illustration">

          <div className="doctor-circle">
            ♟
          </div>

          <p>
            Our team of healthcare professionals
            <br />
            is here to make a difference
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
