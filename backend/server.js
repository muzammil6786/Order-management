const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const { setupSocket } = require('./socket/index');

dotenv.config();

const app = express();
const server = http.createServer(app);

setupSocket(server); // initialize socket

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));