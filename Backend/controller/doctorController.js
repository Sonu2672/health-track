import Doctor from "../model/doctor.js";

export const getDoctors = async (req, res) => {
  try {
    const {
      specialization,
      search,
      minRating,
      maxFee,
      sort,
    } = req.query;

    let query = {};

    // Specialization Filter
    if (specialization && specialization !== "All") {
      query.specialization = specialization;
    }

    // Search
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          specialization: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Rating Filter
    if (minRating) {
      query.rating = {
        $gte: Number(minRating),
      };
    }

    // Fee Filter
    if (maxFee) {
      query.fee = {
        $lte: Number(maxFee),
      };
    }

    let doctorsQuery = Doctor.find(query);

    // Sorting
    if (sort === "rating") {
      doctorsQuery = doctorsQuery.sort({
        rating: -1,
      });
    }

    if (sort === "fee-low") {
      doctorsQuery = doctorsQuery.sort({
        fee: 1,
      });
    }

    if (sort === "fee-high") {
      doctorsQuery = doctorsQuery.sort({
        fee: -1,
      });
    }

    if (sort === "experience") {
      doctorsQuery = doctorsQuery.sort({
        experience: -1,
      });
    }

    const doctors = await doctorsQuery;

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};








export const seedDoctors = async (req, res) => {
  try {

    await Doctor.deleteMany({});

    const doctors = [
      {
        name: "Dr. Arjun Mehta",
        specialization: "General Physician",
        experience: 8,
        rating: 4.8,
        reviews: 120,
        fee: 300,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Priya Sharma",
        specialization: "Cardiologist",
        experience: 10,
        rating: 4.9,
        reviews: 280,
        fee: 500,
        image: "👩‍⚕️",
        gender: "Female",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Rohit Verma",
        specialization: "Pulmonologist",
        experience: 7,
        rating: 4.7,
        reviews: 150,
        fee: 400,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Neha Singh",
        specialization: "Dermatologist",
        experience: 9,
        rating: 4.8,
        reviews: 210,
        fee: 600,
        image: "👩‍⚕️",
        gender: "Female",
        online: false,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Vikram Kapoor",
        specialization: "Neurologist",
        experience: 14,
        rating: 4.9,
        reviews: 350,
        fee: 900,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Anjali Gupta",
        specialization: "Gynecologist",
        experience: 11,
        rating: 4.7,
        reviews: 190,
        fee: 700,
        image: "👩‍⚕️",
        gender: "Female",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Rajesh Kumar",
        specialization: "Orthopedic Surgeon",
        experience: 15,
        rating: 4.9,
        reviews: 420,
        fee: 800,
        image: "👨‍⚕️",
        gender: "Male",
        online: false,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Sneha Patel",
        specialization: "Psychiatrist",
        experience: 8,
        rating: 4.8,
        reviews: 170,
        fee: 650,
        image: "👩‍⚕️",
        gender: "Female",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Amit Joshi",
        specialization: "Endocrinologist",
        experience: 12,
        rating: 4.8,
        reviews: 240,
        fee: 750,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Kavita Rao",
        specialization: "Pediatrician",
        experience: 10,
        rating: 4.9,
        reviews: 310,
        fee: 500,
        image: "👩‍⚕️",
        gender: "Female",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Suresh Iyer",
        specialization: "Gastroenterologist",
        experience: 13,
        rating: 4.7,
        reviews: 220,
        fee: 850,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Pooja Malhotra",
        specialization: "Ophthalmologist",
        experience: 9,
        rating: 4.8,
        reviews: 180,
        fee: 550,
        image: "👩‍⚕️",
        gender: "Female",
        online: false,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Rahul Malhotra",
        specialization: "ENT Specialist",
        experience: 11,
        rating: 4.6,
        reviews: 160,
        fee: 450,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Meera Nair",
        specialization: "Nephrologist",
        experience: 14,
        rating: 4.9,
        reviews: 290,
        fee: 900,
        image: "👩‍⚕️",
        gender: "Female",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Sanjay Das",
        specialization: "Urologist",
        experience: 16,
        rating: 4.8,
        reviews: 370,
        fee: 850,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Riya Chatterjee",
        specialization: "Nutritionist",
        experience: 6,
        rating: 4.7,
        reviews: 110,
        fee: 350,
        image: "👩‍⚕️",
        gender: "Female",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Aditya Jain",
        specialization: "Physiotherapist",
        experience: 7,
        rating: 4.6,
        reviews: 130,
        fee: 400,
        image: "👨‍⚕️",
        gender: "Male",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Nisha Verma",
        specialization: "Psychologist",
        experience: 8,
        rating: 4.8,
        reviews: 200,
        fee: 600,
        image: "👩‍⚕️",
        gender: "Female",
        online: true,
        languages: ["Hindi", "English"],
      },

      {
        name: "Dr. Deepak Mishra",
        specialization: "Oncologist",
        experience: 18,
        rating: 4.9,
        reviews: 500,
        fee: 1200,
        image: "👨‍⚕️",
        gender: "Male",
        online: false,
        languages: ["Hindi", "English"],
      },
    ];

    await Doctor.insertMany(doctors);

    res.status(201).json({
      success: true,
      message: "Dummy doctors added successfully",
      count: doctors.length,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};