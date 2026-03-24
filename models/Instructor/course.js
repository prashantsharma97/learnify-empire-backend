const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficultyLevel: { type: String, required: true },
  thumbnail: { type: String, required: false }, 
  lessons: [lessonSchema],  
  pricingInfo: {
    coursePrice: { type: Number, required: true },
    paymentType: { type: String, enum: ['free', 'paid'], required: true }
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;


/** 
* Paste one or more documents here
*/
// {
//   "username": "teacher1",
//   "email": "teacher1@gmail.com",
//   "phone": "9630456621",
//   "password": "$2a$12$blCw6KAt3Yb1jrra63xLpO2WSjGEtW/I1I7uhmcAW4RyRKEjXcuIO",
//   "role": "instructor",
//   "tenantId": "teacher1",
//   "profileImage": "uploads/1774005671762-WhatsApp Image 2025-12-16 at 5.33.24 PM.jpeg",
//   "bio": "gandu bhai 11111",
//   "__v": 0
// }
