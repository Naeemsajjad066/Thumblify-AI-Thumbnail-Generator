import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import AuthRouter from './routes/AuthRoutes.js';
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';

await connectDB();
const app = express();

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
// Needed so secure cookies work behind Vercel/Proxy
if (isProduction) {
    app.set('trust proxy', 1);
}



const port = process.env.PORT|| 3000;
app.use(cors({
    origin:['http://localhost:5173','http://localhost:5174','http://localhost:3000','https://thumblify-by-naeem.vercel.app'],
    credentials:true,

}))

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    name: 'sessionId', // Explicit cookie name
    cookie:{
        maxAge: 1000* 60 * 60 *24 *7, // 7-days expiry
        httpOnly: true,
        secure: isProduction, // Only secure in production/https
        sameSite: isProduction ? 'none' : 'lax', // Cross-site only in production
        path: '/'
    },
    store:MongoStore.create({
        mongoUrl:process.env.MONGODB_URI,
        collectionName:'sessions',
        touchAfter: 24 * 3600 // Lazy session update (seconds)
    })
}))

app.use(express.json())

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - SessionID: ${req.sessionID || 'none'}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Server is Live!');
});

app.use('/api/auth',AuthRouter)
app.use('/api/thumbnail',ThumbnailRouter)
app.use('/api/user',UserRouter)


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});