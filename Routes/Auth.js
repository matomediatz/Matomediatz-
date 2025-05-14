// Project: Mato Media TZ - Music Distribution Platform // Stack: React (Frontend), Node.js + Express (Backend), MongoDB (Database), AWS S3, JWT, Multer, M-Pesa Integration, Email Verification, Tailwind UI

// ==== BACKEND (Node.js + Express) ==== //

// File: server.js const express = require('express'); const mongoose = require('mongoose'); const cors = require('cors'); const fileUpload = require('express-fileupload'); const nodemailer = require('nodemailer'); require('dotenv').config();

const app = express(); app.use(cors()); app.use(express.json()); app.use(fileUpload());

// Routes const authRoutes = require('./routes/auth'); const songRoutes = require('./routes/songs'); const royaltyRoutes = require('./routes/royalties'); const adminRoutes = require('./routes/admin'); const paymentRoutes = require('./routes/payment');

app.use('/api/auth', authRoutes); app.use('/api/songs', songRoutes); app.use('/api/royalties', royaltyRoutes); app.use('/api/admin', adminRoutes); app.use('/api/payments', paymentRoutes);

mongoose.connect(process.env.MONGO_URI, () => console.log('MongoDB Connected')); app.listen(5000, () => console.log('Server running on port 5000'));

// ==== MODELS ==== //

// File: models/User.js const mongoose = require('mongoose'); const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, emailVerified: { type: Boolean, default: false }, role: { type: String, default: 'artist' } }); module.exports = mongoose.model('User', UserSchema);

// ==== EMAIL SERVICE ==== //

// File: utils/mailer.js const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });

exports.sendVerificationEmail = (user, token) => { const url = http://localhost:3000/verify-email?token=${token}; transporter.sendMail({ from: process.env.EMAIL_USER, to: user.email, subject: 'Verify your email', html: <a href="${url}">Click to verify</a> }); };

// ==== AUTH WITH EMAIL VERIFICATION ==== //

// File: routes/auth.js const router = require('express').Router(); const User = require('../models/User'); const jwt = require('jsonwebtoken'); const { sendVerificationEmail } = require('../utils/mailer');

router.post('/register', async (req, res) => { const user = new User(req.body); await user.save(); const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); sendVerificationEmail(user, token); res.send({ message: 'User registered. Check email for verification.' }); });

router.get('/verify-email', async (req, res) => { try { const decoded = jwt.verify(req.query.token, process.env.JWT_SECRET); await User.findByIdAndUpdate(decoded.id, { emailVerified: true }); res.send('Email verified successfully.'); } catch (err) { res.status(400).send('Invalid token'); } });

router.post('/login', async (req, res) => { const user = await User.findOne({ email: req.body.email }); if (!user || user.password !== req.body.password) return res.status(400).send('Invalid credentials'); if (!user.emailVerified) return res.status(403).send('Email not verified'); const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); res.send({ token, user }); });

module.exports = router;

// ==== PAYMENT MOCK (M-PESA FLUTTERWAVE DEMO) ==== //

// File: routes/payment.js const router = require('express').Router();

router.post('/pay', async (req, res) => { // Hapa unaweza kuongeza API call ya Flutterwave/M-Pesa SDK res.send({ message: 'Payment processed (mock)' }); });

module.exports = router;

// ==== FRONTEND: Tailwind UI Page Examples ==== //

// File: frontend/src/pages/Dashboard.jsx import React, { useEffect, useState } from 'react'; import axios from 'axios';

export default function Dashboard() { const [royalties, setRoyalties] = useState([]);

useEffect(() => { const token = localStorage.getItem('token'); axios.get('http://localhost:5000/api/royalties', { headers: { Authorization: token } }).then(res => setRoyalties(res.data)); }, []);

return ( <div className="p-4"> <h1 className="text-2xl font-bold">Royalty Dashboard</h1> <table className="mt-4 w-full"> <thead> <tr><th>Song</th><th>Streams</th><th>Revenue</th></tr> </thead> <tbody> {royalties.map((r, i) => ( <tr key={i}><td>{r.song}</td><td>{r.streams}</td><td>${r.revenue}</td></tr> ))} </tbody> </table> </div> ); }

// File: frontend/src/pages/Login.jsx import React, { useState } from 'react'; import axios from 'axios'; import { useNavigate } from 'react-router-dom';

export default function Login() { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const navigate = useNavigate();

const handleSubmit = async (e) => { e.preventDefault(); try { const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }); localStorage.setItem('token', res.data.token); navigate('/dashboard'); } catch (err) { alert(err.response.data); } };

return ( <div className="max-w-md mx-auto mt-20"> <h1 className="text-xl mb-4">Login</h1> <form onSubmit={handleSubmit} className="space-y-4"> <input type="email" placeholder="Email" className="w-full p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} required /> <input type="password" placeholder="Password" className="w-full p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} required /> <button className="bg-blue-500 text-white px-4 py-2">Login</button> </form> </div> ); }

