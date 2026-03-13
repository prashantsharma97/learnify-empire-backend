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
  thumbnail: { type: String, required: false }, // Make thumbnail optional
  lessons: [lessonSchema],  // Store lessons as an array of lesson objects
  pricingInfo: {
    coursePrice: { type: Number, required: true },
    paymentType: { type: String, enum: ['free', 'paid'], required: true }
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
