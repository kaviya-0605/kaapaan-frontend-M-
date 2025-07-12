

// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const port = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// const MONGO_URI = 'mongodb+srv://nt03625:mzRewbYxcaNBVX3A@clusterdb.ycdxi.mongodb.net/traffic_violation?retryWrites=true&w=majority';
// mongoose.connect(MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Violation Schema
// const violationSchema = new mongoose.Schema({
//   imageUrl: String,
//   plateImageUrl: String,
//   analyzedAt: Date,
//   videoFilename: String,
//   noHelmet: Number,
//   phoneUsage: Number,
//   tripling: Number,
//   wrongway: Number,
//   fire: Number,
//   noPlate: Number,
//   smoking: Number,
//   stuntRiding: Number,
//   triples: Number,
//   withHelmet: Number,
//   withoutHelmet: Number,
//   verified: Boolean
// });

// const Violation = mongoose.model('Violation', violationSchema, 'violations');

// // Formatter
// const formatViolation = (v) => {
//   return {
//     _id: v._id,
//     imageUrl: v.imageUrl,
//     plateImageUrl: v.plateImageUrl || null,
//     analyzedAt: v.analyzedAt,
//     videoFilename: v.videoFilename || null,
//     verified: v.verified || false,
//     noHelmet: v.noHelmet || 0,
//     phoneUsage: v.phoneUsage || 0,
//     tripling: v.tripling || 0,
//     wrongway: v.wrongway || 0,
//     fire: v.fire || 0,
//     noPlate: v.noPlate || 0,
//     smoking: v.smoking || 0,
//     stuntRiding: v.stuntRiding || 0,
//     triples: v.triples || 0,
//     withHelmet: v.withHelmet || 0,
//     withoutHelmet: v.withoutHelmet || 0
//   };
// };

// // ✅ GET: Unverified Violations (latest 100)
// app.get('/api/violations', async (req, res) => {
//   try {
//     const violations = await Violation.find({ verified: false })
//       .sort({ analyzedAt: -1 })
//       .limit(100);
//     res.json(violations.map(formatViolation));
//   } catch (error) {
//     console.error('❌ Error fetching violations:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // ✅ PATCH: Verify Multiple Violations
// app.patch('/api/violations/verify-multiple', async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: 'Invalid or missing ids' });
//     }

//     const result = await Violation.updateMany(
//       { _id: { $in: ids } },
//       { $set: { verified: true } }
//     );

//     res.json({ message: 'Violations verified successfully', result });
//   } catch (error) {
//     console.error('❌ Error verifying multiple violations:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // ✅ GET: All Violations (used in VerifiedScreens)
// app.get('/api/violations/all', async (req, res) => {
//   try {
//     const violations = await Violation.find().sort({ analyzedAt: -1 });
//     res.json(violations.map(formatViolation));
//   } catch (error) {
//     console.error('❌ Error fetching all violations:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // ✅ GET: Statistics Data
// app.get('/api/violations/stats', async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     // Validate dates
//     const start = new Date(startDate);
//     const end = new Date(endDate);
    
//     if (isNaN(start.getTime())) {
//       return res.status(400).json({ message: 'Invalid start date' });
//     }
//     if (isNaN(end.getTime())) {
//       return res.status(400).json({ message: 'Invalid end date' });
//     }

//     // Get all violations within date range
//     const violations = await Violation.find({
//       analyzedAt: {
//         $gte: start,
//         $lte: end
//       }
//     });

//     // Calculate totals
//     const totalViolations = violations.length;
//     const totalVerified = violations.filter(v => v.verified).length;
//     const totalPending = totalViolations - totalVerified;

//     // Calculate violations by type
//     const violationTypes = [
//       'noHelmet', 'phoneUsage', 'tripling', 'wrongway',
//       'fire', 'noPlate', 'smoking', 'stuntRiding',
//       'triples', 'withHelmet', 'withoutHelmet'
//     ];

//     const byType = violationTypes.map(type => {
//       const count = violations.reduce((sum, v) => sum + (v[type] || 0), 0);
//       return {
//         type: type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
//         count,
//         percentage: totalViolations > 0 ? Math.round((count / totalViolations) * 100) : 0
//       };
//     }).filter(item => item.count > 0);

//     // Calculate daily trend
//     const dailyTrend = [];
//     const currentDate = new Date(start);
    
//     while (currentDate <= end) {
//       const dayStart = new Date(currentDate);
//       const dayEnd = new Date(currentDate);
//       dayEnd.setHours(23, 59, 59, 999);
      
//       const dayViolations = violations.filter(v => 
//         v.analyzedAt >= dayStart && v.analyzedAt <= dayEnd
//       ).length;
      
//       dailyTrend.push({
//         day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
//         date: currentDate.toLocaleDateString(),
//         count: dayViolations
//       });
      
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     // Find maximum count for chart scaling
//     const dailyMax = Math.max(...dailyTrend.map(day => day.count), 1);

//     res.json({
//       totalViolations,
//       totalVerified,
//       totalPending,
//       byType,
//       dailyTrend,
//       dailyMax
//     });

//   } catch (error) {
//     console.error('❌ Error fetching statistics:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // ✅ GET: Export Statistics as CSV
// app.get('/api/violations/export-stats', async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
    
//     // Get statistics data
//     const statsResponse = await axios.get(`http://localhost:${port}/api/violations/stats`, {
//       params: { startDate, endDate }
//     });
    
//     const stats = statsResponse.data;

//     // Create CSV content
//     let csvContent = 'Violation Type,Count,Percentage\n';
//     stats.byType.forEach(item => {
//       csvContent += `${item.type},${item.count},${item.percentage}%\n`;
//     });

//     // Set response headers for CSV download
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=violation_stats.csv');
//     res.status(200).send(csvContent);

//   } catch (error) {
//     console.error('❌ Error exporting statistics:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });
// // Police ID Schema
// const policeSchema = new mongoose.Schema({
//   p_id: String,
//   p_password: String
// });

// const Police = mongoose.model('Police', policeSchema, 'police_ids');
// // ✅ GET: All Police Details (excluding passwords)
// app.get('/api/police-ids', async (req, res) => {
//   try {
//     const officers = await policeSchema.find({}, { p_password: 0 }); // Hide password
//     res.status(200).json(officers);
//   } catch (error) {
//     console.error('❌ Error fetching police details:', error);
//     res.status(500).json({ message: 'Server Error fetching police data' });
//   }
// });

// // ✅ POST: Police Login
// app.post('/api/login', async (req, res) => {
//   const { p_id, p_password } = req.body;

//   if (!p_id || !p_password) {
//     return res.status(400).json({ success: false, message: 'p_id and p_password are required' });
//   }

//   try {
//     const officer = await Police.findOne({ p_id });

//     if (!officer) {
//       return res.status(401).json({ success: false, message: 'Invalid Police ID' });
//     }

//     if (officer.p_password !== p_password) {
//       return res.status(401).json({ success: false, message: 'Incorrect Password' });
//     }

//     res.status(200).json({ success: true, message: 'Login successful', officerId: officer._id });
//   } catch (error) {
//     console.error('❌ Error during police login:', error);
//     res.status(500).json({ success: false, message: 'Server error during login' });
//   }
// });


// // ✅ Start Server
// app.listen(5000, '0.0.0.0', () => {
//   `console.log('✅ Server running on http://192.168.42.158:5000')`;
// });








const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://nt03625:mzRewbYxcaNBVX3A@clusterdb.ycdxi.mongodb.net/traffic_violation?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Violation Schema
const violationSchema = new mongoose.Schema({
  imageUrl: String,
  plateImageUrl: String,
  analyzedAt: Date,
  videoFilename: String,
  noHelmet: Number,
  phoneUsage: Number,
  tripling: Number,
  wrongway: Number,
  fire: Number,
  noPlate: Number,
  smoking: Number,
  stuntRiding: Number,
  triples: Number,
  withHelmet: Number,
  withoutHelmet: Number,
  verified: Boolean,
  verifiedBy: { type: String, default: null } // ✅ NEW FIELD
});
const Violation = mongoose.model('Violation', violationSchema, 'violations');

// ✅ Define User schema (for police login)
const detailSchema = new mongoose.Schema({
  p_id: String,
  p_password: String
});
const Detail = mongoose.model('Detail', detailSchema, 'police_ids');

// ✅ Format Violation Function
const formatViolation = (v) => ({
  _id: v._id,
  imageUrl: v.imageUrl,
  plateImageUrl: v.plateImageUrl || null,
  analyzedAt: v.analyzedAt,
  videoFilename: v.videoFilename || null,
  verified: v.verified || false,
  verifiedBy: v.verifiedBy || null,
  noHelmet: v.noHelmet || 0,
  phoneUsage: v.phoneUsage || 0,
  tripling: v.tripling || 0,
  wrongway: v.wrongway || 0,
  fire: v.fire || 0,
  noPlate: v.noPlate || 0,
  smoking: v.smoking || 0,
  stuntRiding: v.stuntRiding || 0,
  triples: v.triples || 0,
  withHelmet: v.withHelmet || 0,
  withoutHelmet: v.withoutHelmet || 0
});

// ✅ GET: Unverified Violations (latest 100)
app.get('/api/violations', async (req, res) => {
  try {
    const violations = await Violation.find({ verified: false }).sort({ analyzedAt: -1 }).limit(100);
    res.json(violations.map(formatViolation));
  } catch (error) {
    console.error('❌ Error fetching violations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ✅ PATCH: Verify Multiple Violations with police ID
app.patch('/api/violations/verify-multiple', async (req, res) => {
  try {
    const { ids, verifiedBy } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid or missing ids' });
    }

    const result = await Violation.updateMany(
      { _id: { $in: ids } },
      { $set: { verified: true, verifiedBy: verifiedBy || 'Unknown' } }
    );

    res.json({ message: 'Violations verified successfully', result });
  } catch (error) {
    console.error('❌ Error verifying violations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ GET: All Violations
app.get('/api/violations/all', async (req, res) => {
  try {
    const violations = await Violation.find().sort({ analyzedAt: -1 });
    res.json(violations.map(formatViolation));
  } catch (error) {
    console.error('❌ Error fetching all violations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ GET: Statistics
app.get('/api/violations/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    const violations = await Violation.find({ analyzedAt: { $gte: start, $lte: end } });
    const totalViolations = violations.length;
    const totalVerified = violations.filter(v => v.verified).length;
    const totalPending = totalViolations - totalVerified;

    const violationTypes = [
      'noHelmet', 'phoneUsage', 'tripling', 'wrongway',
      'fire', 'noPlate', 'smoking', 'stuntRiding',
      'triples', 'withHelmet', 'withoutHelmet'
    ];

    const byType = violationTypes.map(type => {
      const count = violations.reduce((sum, v) => sum + (v[type] || 0), 0);
      return {
        type: type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        count,
        percentage: totalViolations > 0 ? Math.round((count / totalViolations) * 100) : 0
      };
    }).filter(item => item.count > 0);

    const dailyTrend = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const count = violations.filter(v =>
        v.analyzedAt >= dayStart && v.analyzedAt <= dayEnd
      ).length;

      dailyTrend.push({
        day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        date: currentDate.toLocaleDateString(),
        count
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const dailyMax = Math.max(...dailyTrend.map(day => day.count), 1);

    res.json({
      totalViolations,
      totalVerified,
      totalPending,
      byType,
      dailyTrend,
      dailyMax
    });
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET all details
app.get('/api/details', async (req, res) => {
  try {
    const users = await Detail.find({});
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching details:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST: Police Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Login attempt:', username, password);
    const user = await Detail.findOne({ p_id: username, p_password: password });

    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET: Verified Violations by Officer ID
app.get('/api/violations/verified', async (req, res) => {
  try {
    const { officerId } = req.query;

    if (!officerId) {
      return res.status(400).json({ message: 'Missing officerId in query' });
    }

    const violations = await Violation.find({
      verified: true,
      verifiedBy: officerId
    }).sort({ analyzedAt: -1 });

    res.json(violations.map(formatViolation));
  } catch (error) {
    console.error('❌ Error fetching verified violations by officer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ✅ Start Server
app.listen(5000, '0.0.0.0', () => {
  console.log('✅ Server running on http://192.168.42.158:5000');
});
