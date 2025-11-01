import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // explicit id field (optional since mongoose adds _id automatically)
  // id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   default: () => new mongoose.Types.ObjectId(),
  //   alias: '_id'
  // },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create the model
const Product = mongoose.model('Product', productSchema);

export default Product;
