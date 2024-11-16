const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/reviewSystem', { useNewUrlParser: true, useUnifiedTopology: true });

// Review schema and model
const reviewSchema = new mongoose.Schema({
  productName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
});

const Review = mongoose.model('Review', reviewSchema);

// Route to add a review
app.post('/reviews', async (req, res) => {
  const { productName, rating, comment } = req.body;
  const review = new Review({ productName, rating, comment });
  await review.save();
  res.status(201).send('Review added successfully!');
});

// Route to get reviews and average rating
app.get('/reviews/:productName', async (req, res) => {
  const { productName } = req.params;
  const reviews = await Review.find({ productName });
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;
  res.json({ reviews, averageRating });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
