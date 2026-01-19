const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Condition = require("./models/Condition.js");

dotenv.config();

const conditions = [
  {
    exam: "AFCAT",
    cond: [
      {
        Photo: { min: "0.02", max: "0.03" },
        Sign: { min: "0.08", max: "0.15" },
        Thumb: { min: "0.05", max: "0.1" },
      },
    ],
  },
  {
    exam: "Airforce - Agniveer Or Med Assistant",
    cond: [
      {
        Photo: { min: "0.1", max: "0.2" },
        Sign: { min: "0.08", max: "0.15" },
        Thumb: { min: "0.05", max: "0.1" },
      },
    ],
  },
  {
    exam: "SSC GD",
    cond: [
      {
        Photo: { min: "0.02", max: "0.05", width: "3.5cm", height: "4.5cm" },
        Sign: { min: "0.01", max: "0.02", width: "4cm", height: "3cm" },
      },
    ],
  },
  {
    exam: "UPSC",
    cond: [
      {
        NameChange: {
          min: "0.05",
          max: "0.3",
          name: "name_change",
          category: "Universal",
        },
        IdProof: {
          min: "0.02",
          max: "0.2",
          name: "id_card",
          category: "Universal",
        },
        Board: {
          min: "0.05",
          max: "0.3",
          name: "board_certificate",
          type: "pdf",
          category: "Universal",
        },
        Photo: {
          min: "0.02",
          max: "0.2",
          name: "photo",
          category: "Common",
        },
        Sign: {
          min: "0.02",
          max: "0.1",
          width: "500",
          height: "350",
          name: "signature",
          category: "Common",
        },
      },
    ],
  },
  {
    exam: "Railway NTPC",
    cond: [
      {
        Sign: { min: "0.03", max: "0.049", width: "5cm", height: "2cm" },
      },
    ],
  },
  {
    exam: "Railway Group-D",
    cond: [
      {
        Photo: { min: "0.03", max: "0.07", width: "3.5cm", height: "4.5cm" },
        Sign: { min: "0.03", max: "0.07", width: "5cm", height: "2cm" },
      },
    ],
  },
  {
    exam: "UP Police Constable",
    cond: [
      {
        CasteCertificateSC: {
          min: "0.05",
          max: "0.1",
          type: "pdf",
        },
        Domicile: {
          min: "0.05",
          max: "0.1",
          type: "pdf",
        },
        Marksheet_10th: {
          min: "0.05",
          max: "0.1",
          type: "pdf",
        },
        Certificate_10th: {
          min: "0.05",
          max: "0.1",
          type: "pdf",
        },
        Marksheet_12th: {
          min: "0.05",
          max: "0.1",
          type: "pdf",
        },
        Certificate_12th: {
          min: "0.05",
          max: "0.1",
          type: "pdf",
        },
        Sign: {
          min: "0.005",
          max: "0.02",
          width: "5cm",
          height: "2cm",
        },
      },
    ],
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    await Condition.deleteMany();
    await Condition.insertMany(conditions);

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDB();