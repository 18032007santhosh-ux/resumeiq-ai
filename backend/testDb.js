const mongoose = require('mongoose');
require('dotenv').config();
const Resume = require('./models/Resume');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resumeiq');
    const resume = await Resume.findById('6a490a3950c40ed8f0a68128');
    if (resume) {
      console.log("FOUND!");
      console.log(JSON.stringify(resume.parsedData, null, 2));
    } else {
      console.log("NOT FOUND IN DB!");
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
run();
