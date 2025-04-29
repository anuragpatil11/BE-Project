const express = require('express');
const cors = require("cors");
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/loginRoutes');
const wardenRoutes = require('./routes/wardenRoutes');
const summarizeRoutes = require('./routes/summarizeRoutes');
const errorHandler = require('./middleware/errorHandler');
const downloadExelFileRoutes = require('./routes/downloadExelFileRotes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// handling cors polices
const corsOptions = {
    origin: ["http://localhost:5173", "http://192.168.0.101:5173"],
    methods: "GET,POST,DELETE,PUT,PATCH,HEAD",
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandler);

// Admin Routes
app.use('/api/admin', adminRoutes);

// Student Routes
app.use('/api/student', studentRoutes);

// User Routes
app.use('/api/user', userRoutes);

// Warden Routes
app.use('/api/warden', wardenRoutes);

//  paf summarization routes
app.use('/api/summarize', summarizeRoutes);

// download excel file routes
app.use('/api/download', downloadExelFileRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});