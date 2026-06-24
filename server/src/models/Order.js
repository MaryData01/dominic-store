import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderRef: {
      type: String,
      unique: true,
      required: true,
    },
    paystackRef: {
      type: String,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate orderRef if not provided
orderSchema.pre('validate', function(next) {
  if (!this.orderRef) {
    this.orderRef = `DS-${Date.now()}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
