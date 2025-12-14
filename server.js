// ===== Dependencies =====
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const crypto = require('crypto');
require('dotenv').config();

// ===== Initialize Express App =====
const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || './data/database.json';
const UPLOADS_DIR = './uploads';

// ===== Middleware =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.session && req.session.userId) {
        console.log(`  User: ${req.session.username || req.session.userId}`);
    }
    next();
});

app.use(express.static('public'));
app.use('/uploads', express.static(UPLOADS_DIR));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'manipur-archives-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: parseInt(process.env.SESSION_TIMEOUT) || 3600000, // 1 hour
        sameSite: 'lax'
    },
    name: 'manipur.archives.sid'
}));

// ===== File Upload Configuration =====
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(UPLOADS_DIR, 'documents');
        if (!fsSync.existsSync(uploadPath)) {
            fsSync.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf', 'audio/mpeg', 'audio/wav', 'video/mp4'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// ===== Database Functions =====
async function initDatabase() {
    try {
        // Create data directory if it doesn't exist
        const dataDir = path.dirname(DB_FILE);
        if (!fsSync.existsSync(dataDir)) {
            await fs.mkdir(dataDir, { recursive: true });
        }
        
        // Create uploads directories
        const uploadDirs = ['documents', 'thumbnails', 'collections', 'news', 'publications'];
        for (const dir of uploadDirs) {
            const dirPath = path.join(UPLOADS_DIR, dir);
            if (!fsSync.existsSync(dirPath)) {
                await fs.mkdir(dirPath, { recursive: true });
            }
        }
        
        // Initialize database file if it doesn't exist
        if (!fsSync.existsSync(DB_FILE)) {
            const initialData = {
                documents: [
                    {
                        id: 'DOC001',
                        referenceNumber: 'MSA/2024/001',
                        title: 'Royal Decree on Land Settlement',
                        description: 'Historical document regarding land distribution in Manipur Kingdom during the reign of Maharaja Churachand Singh',
                        creator: 'Maharaja Churachand Singh',
                        date: { from: '1920-03-15', to: '1920-03-15' },
                        language: ['Meitei', 'English'],
                        physicalDescription: '2 pages, handwritten, ink on paper',
                        subjects: ['Land Records', 'Royal Administration', 'Colonial Era'],
                        collection: 'COL001',
                        location: 'Shelf A, Box 12',
                        accessRestrictions: 'Public',
                        copyrightStatus: 'Public Domain',
                        coverImage: '/images/collection-royal.jpg',
                        files: [{
                            type: 'image',
                            url: '/images/collection-royal.jpg',
                            thumbnail: '/images/collection-royal.jpg'
                        }],
                        views: 245,
                        downloads: 67,
                        featured: true,
                        published: true,
                        createdAt: '2024-01-15T10:30:00Z',
                        updatedAt: '2024-03-20T14:22:00Z',
                        createdBy: 'USR001'
                    },
                    {
                        id: 'DOC002',
                        referenceNumber: 'MSA/2024/002',
                        title: 'Freedom Movement Correspondence',
                        description: 'Letters exchanged between freedom fighters during India\'s independence movement',
                        creator: 'Various Authors',
                        date: { from: '1942-08-09', to: '1947-08-15' },
                        language: ['English', 'Hindi'],
                        physicalDescription: '15 pages, typed documents',
                        subjects: ['Freedom Movement', 'Independence', 'Historical Correspondence'],
                        collection: 'COL002',
                        location: 'Shelf B, Box 5',
                        accessRestrictions: 'Public',
                        copyrightStatus: 'Public Domain',
                        coverImage: '/images/collection-freedom.jpg',
                        files: [{
                            type: 'image',
                            url: '/images/collection-freedom.jpg',
                            thumbnail: '/images/collection-freedom.jpg'
                        }],
                        views: 189,
                        downloads: 45,
                        featured: true,
                        published: true,
                        createdAt: '2024-02-10T09:15:00Z',
                        updatedAt: '2024-03-18T11:30:00Z',
                        createdBy: 'USR001'
                    }
                ],
                collections: [
                    {
                        id: 'COL001',
                        name: 'Royal Chronicles',
                        description: 'Official records and correspondence of Manipur Kingdom rulers from 1709-1947',
                        coverImage: '/images/collection-royal.jpg',
                        itemCount: 342,
                        dateRange: '1709-1947',
                        featured: true,
                        createdAt: '2024-01-10T09:00:00Z'
                    },
                    {
                        id: 'COL002',
                        name: 'Freedom Movement',
                        description: 'Documents related to Manipur\'s role in India\'s independence struggle',
                        coverImage: '/images/collection-freedom.jpg',
                        itemCount: 218,
                        dateRange: '1930-1950',
                        featured: true,
                        createdAt: '2024-01-10T09:15:00Z'
                    },
                    {
                        id: 'COL003',
                        name: 'Colonial Administration',
                        description: 'British administrative records and correspondence from colonial period',
                        coverImage: '/images/collection-colonial.jpg',
                        itemCount: 456,
                        dateRange: '1891-1947',
                        featured: true,
                        createdAt: '2024-01-10T09:30:00Z'
                    },
                    {
                        id: 'COL004',
                        name: 'Cultural Heritage',
                        description: 'Manuscripts, photographs, and documents related to Manipuri culture',
                        coverImage: '/images/collection-cultural.jpg',
                        itemCount: 567,
                        dateRange: '1800-2000',
                        featured: true,
                        createdAt: '2024-01-10T09:45:00Z'
                    }
                ],
                users: [{
                    id: 'USR001',
                    username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
                    password: await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'Manipur@2024', 10),
                    role: 'superadmin',
                    name: 'Administrator',
                    email: 'admin@manipur.gov.in',
                    permissions: ['all'],
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                }],
                research_requests: [
                    {
                        id: 'RR001',
                        researcherName: 'Dr. Anita Sharma',
                        email: 'anita.sharma@university.edu',
                        phone: '+91-9876543210',
                        affiliation: 'Manipur University',
                        researchTopic: 'Colonial Administration in Manipur',
                        specificRequirements: 'Looking for correspondence between British Political Agent and Maharaja from 1891-1947',
                        timeframe: '2-3 weeks',
                        attachments: [],
                        status: 'pending',
                        submittedAt: '2024-03-15T11:20:00Z',
                        updatedAt: '2024-03-15T11:20:00Z',
                        messages: []
                    }
                ],
                service_requests: [],
                news: [
                    {
                        id: 'NEWS001',
                        title: 'New Digital Archive Collection Now Available',
                        excerpt: 'We are pleased to announce the addition of over 500 digitized documents from the Royal Chronicles collection.',
                        content: 'The Manipur State Archives is proud to announce the latest addition to our digital collection. Over 500 documents from the Royal Chronicles have been carefully digitized and are now available for researchers and the public...',
                        image: '/images/news-placeholder.jpg',
                        publishedAt: '2024-03-01T10:00:00Z',
                        featured: true,
                        author: 'Archives Team'
                    }
                ],
                events: [],
                gallery: [],
                pages: {
                    about: { 
                        content: 'The Manipur State Archives was established in 1972 with the mission to collect, preserve, and provide access to the documentary heritage of Manipur...' 
                    },
                    services: { 
                        content: 'We offer various services including research assistance, document reproduction, and educational programs...' 
                    },
                    research: { 
                        content: 'Access our comprehensive research resources, finding aids, and consultation services...' 
                    }
                },
                settings: {
                    archiveName: 'Manipur State Archives',
                    tagline: 'Preserving Our Heritage, Empowering Our Future',
                    address: 'Palace Compound, Imphal, Manipur 795001',
                    phone: '+91-385-2450888',
                    email: 'archives@manipur.gov.in',
                    hours: 'Monday-Friday 10:00 AM - 5:00 PM',
                    featuredCollections: ['COL001', 'COL002', 'COL003', 'COL004']
                },

// Inside initDatabase(), add to initialData:
notifications: [
    {
        id: 'NOTIF001',
        type: 'info',
        title: 'New Collection Added',
        message: 'Royal Chronicles collection has been updated with 25 new documents',
        link: 'collections',
        linkText: 'View Collection',
        published: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdBy: 'USR001'
    },
    {
        id: 'NOTIF002',
        type: 'success',
        title: 'System Update Complete',
        message: 'Digital archives system has been successfully updated with new features',
        link: 'digital-archives',
        linkText: 'Explore',
        published: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        createdBy: 'USR001'
    }
],

                analytics: {
                    totalViews: 1245,
                    totalDownloads: 378,
                    searchQueries: [],
                    popularDocuments: []
                },
                contact_messages: [],
                feedback: [],
                newsletter_subscribers: []
            };
            
            await writeDatabase(initialData);
            console.log('Database initialized with sample data');
        }
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}

async function readDatabase() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        throw error;
    }
}

async function writeDatabase(data) {
    try {
        // Create backup before writing
        if (fsSync.existsSync(DB_FILE)) {
            const backupDir = process.env.BACKUP_DIR || './backups';
            if (!fsSync.existsSync(backupDir)) {
                await fs.mkdir(backupDir, { recursive: true });
            }
            const backupFile = path.join(backupDir, `backup-${Date.now()}.json`);
            await fs.copyFile(DB_FILE, backupFile);
            
            // Keep only last 7 backups
            const backups = await fs.readdir(backupDir);
            if (backups.length > 7) {
                backups.sort();
                for (let i = 0; i < backups.length - 7; i++) {
                    await fs.unlink(path.join(backupDir, backups[i]));
                }
            }
        }
        
        await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing database:', error);
        throw error;
    }
}

// ===== Authentication Middleware =====
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        console.log('Auth failed - No session or userId:', req.session);
        res.status(401).json({ error: 'Authentication required', authenticated: false });
    }
}

function requireRole(roles) {
    return async (req, res, next) => {
        if (!req.session || !req.session.userId) {
            console.log('Role check failed - No session');
            return res.status(401).json({ error: 'Authentication required', authenticated: false });
        }
        
        try {
            const db = await readDatabase();
            const user = db.users.find(u => u.id === req.session.userId);
            
            if (!user) {
                console.log('Role check failed - User not found');
                return res.status(401).json({ error: 'User not found', authenticated: false });
            }
            
            if (!roles.includes(user.role)) {
                console.log('Role check failed - Insufficient permissions');
                return res.status(403).json({ error: 'Insufficient permissions' });
            }
            
            req.user = user;
            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}

// ===== Helper Functions =====
function generateId(prefix) {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

async function trackAnalytics(type, data) {
    try {
        const db = await readDatabase();
        
        switch (type) {
            case 'view':
                db.analytics.totalViews++;
                break;
            case 'download':
                db.analytics.totalDownloads++;
                break;
            case 'search':
                db.analytics.searchQueries.push({
                    query: data.query,
                    timestamp: new Date().toISOString()
                });
                // Keep only last 1000 queries
                if (db.analytics.searchQueries.length > 1000) {
                    db.analytics.searchQueries = db.analytics.searchQueries.slice(-1000);
                }
                break;
        }
        
        await writeDatabase(db);
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

// ===== API Routes =====

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        const db = await readDatabase();
        const user = db.users.find(u => u.username === username);
        
        if (!user) {
            console.log('Login failed - User not found:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            console.log('Login failed - Invalid password for user:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        await writeDatabase(db);
        
        // Set session - This is critical!
        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.username = user.username;
        
        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session error' });
            }
            
            console.log('Login successful for user:', username, 'Session ID:', req.session.id);
            
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    email: user.email
                }
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({ error: 'Logout failed', success: false });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        });
    } else {
        res.json({ success: true, message: 'No active session' });
    }
});

app.get('/api/auth/check', async (req, res) => {
    console.log('Auth check - Session:', req.session);
    
    if (!req.session || !req.session.userId) {
        return res.json({ authenticated: false });
    }
    
    try {
        const db = await readDatabase();
        const user = db.users.find(u => u.id === req.session.userId);
        
        if (!user) {
            return res.json({ authenticated: false });
        }
        
        console.log('Auth check successful for user:', user.username);
        
        res.json({
            authenticated: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ error: 'Internal server error', authenticated: false });
    }
});

// Add this route in your server.js with the other analytics routes
app.post('/api/analytics/track', async (req, res) => {
    try {
        const { type, data } = req.body;
        await trackAnalytics(type, data);
        res.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        // Return success anyway since analytics shouldn't break the app
        res.json({ success: true });
    }
});

// Documents Routes
app.get('/api/documents', async (req, res) => {
    try {
        const db = await readDatabase();
        let documents = db.documents.filter(doc => doc.published);
        
        // Apply filters
        const { search, collection, language, dateFrom, dateTo, limit, offset, sort, order } = req.query;
        
        if (search) {
            const searchLower = search.toLowerCase();
            documents = documents.filter(doc => 
                doc.title.toLowerCase().includes(searchLower) ||
                doc.description.toLowerCase().includes(searchLower) ||
                (doc.subjects && doc.subjects.some(s => s.toLowerCase().includes(searchLower)))
            );
        }
        
        if (collection) {
            documents = documents.filter(doc => doc.collection === collection);
        }
        
        if (language) {
            documents = documents.filter(doc => doc.language && doc.language.includes(language));
        }
        
        if (dateFrom) {
            documents = documents.filter(doc => doc.date && doc.date.from >= dateFrom);
        }
        
        if (dateTo) {
            documents = documents.filter(doc => doc.date && doc.date.to <= dateTo);
        }
        
        // Sort
        const sortField = sort || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;
        documents.sort((a, b) => {
            if (a[sortField] < b[sortField]) return -sortOrder;
            if (a[sortField] > b[sortField]) return sortOrder;
            return 0;
        });
        
        // Pagination
        const total = documents.length;
        const start = parseInt(offset) || 0;
        const limitNum = parseInt(limit) || 20;
        documents = documents.slice(start, start + limitNum);
        
        res.json({
            documents,
            total,
            offset: start,
            limit: limitNum
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/documents/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        const document = db.documents.find(doc => doc.id === req.params.id);
        
        if (!document || !document.published) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        // Increment view count
        document.views = (document.views || 0) + 1;
        await writeDatabase(db);
        await trackAnalytics('view', { documentId: document.id });
        
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/documents', requireRole(['superadmin', 'archivist', 'cataloguer']), async (req, res) => {
    try {
        console.log('Creating document, user:', req.user.username);
        console.log('Document data:', req.body);
        
        const db = await readDatabase();
        
        if (!db.documents) {
            db.documents = [];
        }
        
        const document = {
    id: generateId('DOC'),
    referenceNumber: req.body.referenceNumber || '',
    title: req.body.title,
    description: req.body.description || '',
    creator: req.body.creator || '',
    date: req.body.date || { from: '', to: '' },
    language: req.body.language || [],
    physicalDescription: req.body.physicalDescription || '',
    subjects: req.body.subjects || [],
    collection: req.body.collection || '',
    location: req.body.location || '',
    accessRestrictions: req.body.accessRestrictions || 'Public',
    copyrightStatus: req.body.copyrightStatus || 'Unknown',
    coverImage: req.body.coverImage || '',  // ADD THIS LINE
    files: req.body.files || [],
    views: 0,
    downloads: 0,
    featured: req.body.featured || false,
    published: req.body.published || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: req.user.id
};
        
        db.documents.push(document);
        await writeDatabase(db);
        
        console.log('Document created successfully:', document.id);
        res.status(201).json({ document, success: true, id: document.id });
    } catch (error) {
        console.error('Document creation error:', error);
        res.status(500).json({ error: 'Failed to create document: ' + error.message, success: false });
    }
});

// Newsletter Routes
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ error: 'Valid email required' });
        }
        
        const db = await readDatabase();
        
        if (!db.newsletter_subscribers) {
            db.newsletter_subscribers = [];
        }
        
        // Check if already subscribed
        const existing = db.newsletter_subscribers.find(sub => sub.email === email);
        if (existing) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }
        
        const subscriber = {
            id: generateId('SUB'),
            email: email,
            subscribedAt: new Date().toISOString(),
            active: true
        };
        
        db.newsletter_subscribers.push(subscriber);
        await writeDatabase(db);
        
        res.json({ success: true, message: 'Successfully subscribed!' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ error: 'Subscription failed. Please try again.' });
    }
});

app.get('/api/newsletter/subscribers', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        res.json({ subscribers: db.newsletter_subscribers || [] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/documents/:id', requireRole(['superadmin', 'archivist', 'cataloguer']), async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.documents.findIndex(doc => doc.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        db.documents[index] = {
            ...db.documents[index],
            ...req.body,
            id: req.params.id,
            updatedAt: new Date().toISOString()
        };
        
        await writeDatabase(db);
        res.json(db.documents[index]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/documents/:id', requireRole(['superadmin', 'archivist']), async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.documents.findIndex(doc => doc.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        // ACTUALLY REMOVE from array instead of soft delete
        db.documents.splice(index, 1);
        
        await writeDatabase(db);
        res.json({ success: true, message: 'Document deleted' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/documents/:id/download', async (req, res) => {
    try {
        const db = await readDatabase();
        const doc = db.documents.find(d => d.id === req.params.id);
        
        if (!doc) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        // Increment download count
        doc.downloads = (doc.downloads || 0) + 1;
        await writeDatabase(db);
        await trackAnalytics('download', { documentId: doc.id });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/documents/upload', requireAuth, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        
        const files = req.files.map(file => ({
            type: file.mimetype.startsWith('image') ? 'image' : 'document',
            url: `/uploads/documents/${file.filename}`,
            thumbnail: `/uploads/documents/${file.filename}`,
            originalName: file.originalname,
            size: file.size
        }));
        
        res.json({ files, success: true });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

// Collections Routes
app.get('/api/collections', async (req, res) => {
    try {
        const db = await readDatabase();
        let collections = db.collections || [];
        
        if (req.query.featured === 'true') {
            collections = collections.filter(col => col.featured);
        }
        
        console.log('Returning collections:', collections.length);
        res.json({ collections, success: true });
    } catch (error) {
        console.error('Collections fetch error:', error);
        res.status(500).json({ error: 'Internal server error', collections: [] });
    }
});

app.get('/api/collections/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        const collection = db.collections.find(col => col.id === req.params.id);
        
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        // Get documents in this collection
        const documents = db.documents.filter(doc => 
            doc.collection === collection.id && doc.published
        );
        
        res.json({ ...collection, documents });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/collections', requireRole(['superadmin', 'archivist']), async (req, res) => {
    try {
        console.log('Creating collection, user:', req.user.username);
        console.log('Collection data:', req.body);
        
        const db = await readDatabase();
        
        if (!db.collections) {
            db.collections = [];
        }
        
        const collection = {
            id: generateId('COL'),
            name: req.body.name,
            description: req.body.description,
            dateRange: req.body.dateRange || '',
            featured: req.body.featured || false,
            itemCount: req.body.itemCount || 0,
            coverImage: req.body.coverImage || '',
            createdAt: new Date().toISOString()
        };
        
        db.collections.push(collection);
        await writeDatabase(db);
        
        console.log('Collection created successfully:', collection.id);
        res.status(201).json({ collection, success: true });
    } catch (error) {
        console.error('Collection creation error:', error);
        res.status(500).json({ error: 'Failed to create collection: ' + error.message });
    }
});

app.put('/api/collections/:id', requireRole(['superadmin', 'archivist']), async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.collections.findIndex(col => col.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        db.collections[index] = {
            ...db.collections[index],
            ...req.body,
            id: req.params.id
        };
        
        await writeDatabase(db);
        res.json(db.collections[index]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/collections/:id', requireRole(['superadmin', 'archivist']), async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.collections.findIndex(col => col.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        
        db.collections.splice(index, 1);
        await writeDatabase(db);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// News Routes
app.get('/api/news', async (req, res) => {
    try {
        const db = await readDatabase();
        let news = db.news.filter(item => 
            new Date(item.publishedAt) <= new Date()
        );
        
        const { limit, offset } = req.query;
        const start = parseInt(offset) || 0;
        const limitNum = parseInt(limit) || 10;
        
        news = news.slice(start, start + limitNum);
        
        res.json({ news, total: db.news.length });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/news/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        const news = db.news.find(item => item.id === req.params.id);
        
        if (!news) {
            return res.status(404).json({ error: 'News not found' });
        }
        
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/news', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        
        if (!db.news) {
            db.news = [];
        }
        
        const newsItem = {
            id: generateId('NEWS'),
            title: req.body.title,
            excerpt: req.body.excerpt || '',
            content: req.body.content,
            image: req.body.image || '',
            publishedAt: req.body.publishedAt || new Date().toISOString(),
            featured: req.body.featured || false,
            author: req.body.author || 'Archives Team'
        };
        
        db.news.push(newsItem);
        await writeDatabase(db);
        
        res.status(201).json({ newsItem, success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/news/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.news.findIndex(item => item.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'News not found' });
        }
        
        db.news[index] = {
            ...db.news[index],
            ...req.body,
            id: req.params.id
        };
        
        await writeDatabase(db);
        res.json({ news: db.news[index], success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/news/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.news.findIndex(item => item.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'News not found' });
        }
        
        db.news.splice(index, 1);
        await writeDatabase(db);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Contact & Feedback Routes
app.post('/api/contact', async (req, res) => {
    try {
        const db = await readDatabase();
        const message = {
            id: generateId('MSG'),
            ...req.body,
            createdAt: new Date().toISOString(),
            read: false
        };
        
        db.contact_messages.push(message);
        await writeDatabase(db);
        
        res.json({ success: true, id: message.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/contact-messages', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        res.json({ messages: db.contact_messages || [] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/contact-messages/:id/read', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const message = db.contact_messages.find(m => m.id === req.params.id);
        
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        
        message.read = true;
        await writeDatabase(db);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/contact-messages/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.contact_messages.findIndex(m => m.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Message not found' });
        }
        
        db.contact_messages.splice(index, 1);
        await writeDatabase(db);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Gallery Routes
app.get('/api/gallery', async (req, res) => {
    try {
        const db = await readDatabase();
        const gallery = db.gallery || [];
        const published = gallery.filter(item => item.published);
        res.json({ gallery: published });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/gallery', requireAuth, upload.array('images', 20), async (req, res) => {
    try {
        const db = await readDatabase();
        
        if (!db.gallery) {
            db.gallery = [];
        }
        
        const galleryItems = req.files.map(file => ({
            id: generateId('GAL'),
            title: req.body.title || file.originalname,
            description: req.body.description || '',
            url: `/uploads/documents/${file.filename}`,
            thumbnail: `/uploads/documents/${file.filename}`,
            published: req.body.published === 'true',
            uploadedAt: new Date().toISOString(),
            uploadedBy: req.session.userId
        }));
        
        db.gallery.push(...galleryItems);
        await writeDatabase(db);
        
        res.status(201).json({ success: true, items: galleryItems });
    } catch (error) {
        console.error('Gallery upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/gallery/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.gallery.findIndex(item => item.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }
        
        db.gallery[index] = {
            ...db.gallery[index],
            title: req.body.title,
            description: req.body.description,
            published: req.body.published,
            updatedAt: new Date().toISOString()
        };
        
        await writeDatabase(db);
        
        res.json({ success: true, item: db.gallery[index] });
    } catch (error) {
        console.error('Gallery update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/gallery/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const index = db.gallery.findIndex(item => item.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }
        
        db.gallery.splice(index, 1);
        await writeDatabase(db);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Research Request Routes
app.post('/api/research-requests', async (req, res) => {
    try {
        console.log('Creating research request:', req.body);
        
        const db = await readDatabase();
        
        if (!db.research_requests) {
            db.research_requests = [];
        }
        
        const request = {
            id: generateId('RR'),
            researcherName: req.body.researcherName,
            email: req.body.email,
            phone: req.body.phone || '',
            affiliation: req.body.affiliation || '',
            researchTopic: req.body.researchTopic,
            specificRequirements: req.body.specificRequirements,
            timeframe: req.body.timeframe || '',
            status: 'pending',
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: []
        };
        
        db.research_requests.push(request);
        await writeDatabase(db);
        
        console.log('Research request created:', request.id);
        res.status(201).json({ request, success: true });
    } catch (error) {
        console.error('Research request error:', error);
        res.status(500).json({ error: 'Failed to create request: ' + error.message });
    }
});

app.get('/api/research-requests', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        res.json({ requests: db.research_requests || [], success: true });
    } catch (error) {
        console.error('Fetch research requests error:', error);
        res.status(500).json({ error: 'Internal server error', requests: [] });
    }
});

app.put('/api/research-requests/:id/status', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const request = db.research_requests.find(r => r.id === req.params.id);
        
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        request.status = req.body.status;
        request.updatedAt = new Date().toISOString();
        
        await writeDatabase(db);
        
        res.json({ request, success: true });
    } catch (error) {
        console.error('Update request status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analytics Routes
app.get('/api/analytics/overview', requireAuth, async (req, res) => {
    try {
        console.log('Fetching analytics for user:', req.session.username);
        
        const db = await readDatabase();
        
        const overview = {
            totalDocuments: (db.documents || []).length,
            totalCollections: (db.collections || []).length,
            totalViews: db.analytics?.totalViews || 0,
            totalDownloads: db.analytics?.totalDownloads || 0,
            monthlyUploads: (db.documents || []).filter(doc => {
                const uploadDate = new Date(doc.createdAt);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return uploadDate > oneMonthAgo;
            }).length,
            pendingRequests: (db.research_requests || []).filter(r => r.status === 'pending').length
        };
        
        console.log('Analytics:', overview);
        res.json(overview);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            totalDocuments: 0,
            totalCollections: 0,
            totalViews: 0,
            totalDownloads: 0,
            monthlyUploads: 0,
            pendingRequests: 0
        });
    }
});

app.get('/api/analytics/search-trends', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        const searchQueries = db.analytics?.searchQueries || [];
        
        // Count keyword occurrences
        const keywordCounts = {};
        searchQueries.forEach(query => {
            const keyword = query.query?.toLowerCase() || '';
            if (keyword) {
                keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
            }
        });
        
        // Convert to array and sort
        const keywords = Object.entries(keywordCounts)
            .map(([keyword, count]) => ({ keyword, count }))
            .sort((a, b) => b.count - a.count);
        
        res.json({ keywords, success: true });
    } catch (error) {
        console.error('Search trends error:', error);
        res.json({ keywords: [], success: false });
    }
});

// Add this with your other analytics routes
app.get('/api/analytics/stats', async (req, res) => {
    try {
        const db = await readDatabase();
        
        // Count documents
        const totalDocuments = (db.documents || []).filter(doc => doc.published).length;
        
        // Count photographs (documents with image files)
        const totalPhotographs = (db.documents || []).filter(doc => 
            doc.published && doc.files && doc.files.some(f => f.type === 'image')
        ).length;
        
        // Count manuscripts (you can adjust this logic based on your classification)
        const totalManuscripts = (db.documents || []).filter(doc => 
            doc.published && doc.subjects && doc.subjects.includes('Manuscripts')
        ).length;
        
        // Calculate years covered
        let minYear = new Date().getFullYear();
        let maxYear = 1700;
        
        (db.documents || []).forEach(doc => {
            if (doc.date && doc.date.from) {
                const year = parseInt(doc.date.from.substring(0, 4));
                if (year < minYear) minYear = year;
                if (year > maxYear) maxYear = year;
            }
        });
        
        const yearsCovered = maxYear - minYear;
        
        res.json({
            totalDocuments,
            totalPhotographs,
            totalManuscripts,
            yearsCovered,
            success: true
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.json({
            totalDocuments: 0,
            totalPhotographs: 0,
            totalManuscripts: 0,
            yearsCovered: 0,
            success: false
        });
    }
});

// ===== Notification Routes =====
// IMPORTANT: Specific routes MUST come before general routes

// Get all notifications for admin (including unpublished) - MUST BE FIRST
app.get('/api/notifications/admin', function(req, res) {
    console.log('Admin notifications endpoint hit');
    console.log('Session:', req.session);
    
    // Check authentication manually
    if (!req.session || !req.session.userId) {
        console.log('Auth failed - no session');
        return res.json({ 
            error: 'Authentication required', 
            notifications: [], 
            success: false 
        });
    }
    
    readDatabase()
        .then(function(db) {
            if (!db.notifications) {
                db.notifications = [];
            }
            
            var notifications = db.notifications.sort(function(a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            console.log('Returning', notifications.length, 'admin notifications');
            res.json({ notifications: notifications, success: true });
        })
        .catch(function(error) {
            console.error('Fetch admin notifications error:', error);
            res.status(500).json({ 
                error: 'Internal server error', 
                notifications: [], 
                success: false 
            });
        });
});

// Mark notification as read - MUST BE BEFORE /:id routes
app.post('/api/notifications/:id/read', function(req, res) {
    res.json({ success: true });
});

// Update notification (admin only)
app.put('/api/notifications/:id', requireAuth, function(req, res) {
    readDatabase()
        .then(function(db) {
            if (!db.notifications) {
                return res.status(404).json({ 
                    error: 'Notification not found', 
                    success: false 
                });
            }
            
            var index = -1;
            for (var i = 0; i < db.notifications.length; i++) {
                if (db.notifications[i].id === req.params.id) {
                    index = i;
                    break;
                }
            }
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Notification not found', 
                    success: false 
                });
            }
            
            db.notifications[index] = {
                id: db.notifications[index].id,
                type: req.body.type,
                title: req.body.title,
                message: req.body.message,
                link: req.body.link || '',
                linkText: req.body.linkText || 'View',
                published: req.body.published,
                createdAt: db.notifications[index].createdAt,
                createdBy: db.notifications[index].createdBy,
                updatedAt: new Date().toISOString()
            };
            
            return writeDatabase(db).then(function() {
                res.json({ 
                    notification: db.notifications[index], 
                    success: true 
                });
            });
        })
        .catch(function(error) {
            console.error('Update notification error:', error);
            res.status(500).json({ 
                error: 'Internal server error', 
                success: false 
            });
        });
});

// Delete notification (admin only)
app.delete('/api/notifications/:id', requireAuth, function(req, res) {
    readDatabase()
        .then(function(db) {
            if (!db.notifications) {
                return res.status(404).json({ 
                    error: 'Notification not found', 
                    success: false 
                });
            }
            
            var index = -1;
            for (var i = 0; i < db.notifications.length; i++) {
                if (db.notifications[i].id === req.params.id) {
                    index = i;
                    break;
                }
            }
            
            if (index === -1) {
                return res.status(404).json({ 
                    error: 'Notification not found', 
                    success: false 
                });
            }
            
            db.notifications.splice(index, 1);
            
            return writeDatabase(db).then(function() {
                res.json({ success: true });
            });
        })
        .catch(function(error) {
            console.error('Delete notification error:', error);
            res.status(500).json({ 
                error: 'Internal server error', 
                success: false 
            });
        });
});

// Get all notifications (public - only published) - MUST BE AFTER SPECIFIC ROUTES
app.get('/api/notifications', function(req, res) {
    console.log('Public notifications endpoint hit');
    
    readDatabase()
        .then(function(db) {
            if (!db.notifications) {
                db.notifications = [];
            }
            
            var notifications = [];
            for (var i = 0; i < db.notifications.length; i++) {
                if (db.notifications[i].published) {
                    notifications.push(db.notifications[i]);
                }
            }
            
            notifications.sort(function(a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            console.log('Returning', notifications.length, 'public notifications');
            res.json({ notifications: notifications, success: true });
        })
        .catch(function(error) {
            console.error('Fetch notifications error:', error);
            res.status(500).json({ 
                error: 'Internal server error', 
                notifications: [], 
                success: false 
            });
        });
});

// Create notification (admin only) - LAST
app.post('/api/notifications', requireAuth, function(req, res) {
    console.log('Creating notification:', req.body);
    
    readDatabase()
        .then(function(db) {
            if (!db.notifications) {
                db.notifications = [];
            }
            
            var notification = {
                id: generateId('NOTIF'),
                type: req.body.type || 'info',
                title: req.body.title,
                message: req.body.message,
                link: req.body.link || '',
                linkText: req.body.linkText || 'View',
                published: req.body.published !== false,
                createdAt: new Date().toISOString(),
                createdBy: req.session.userId
            };
            
            db.notifications.push(notification);
            
            return writeDatabase(db).then(function() {
                console.log('Notification created:', notification.id);
                res.status(201).json({ 
                    notification: notification, 
                    success: true 
                });
            });
        })
        .catch(function(error) {
            console.error('Create notification error:', error);
            res.status(500).json({ 
                error: 'Failed to create notification: ' + error.message, 
                success: false 
            });
        });
});
// Update notification (admin only) - FOURTH
app.put('/api/notifications/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db.notifications) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        const index = db.notifications.findIndex(n => n.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        db.notifications[index] = {
            ...db.notifications[index],
            type: req.body.type,
            title: req.body.title,
            message: req.body.message,
            link: req.body.link || '',
            linkText: req.body.linkText || 'View',
            published: req.body.published,
            updatedAt: new Date().toISOString()
        };
        
        await writeDatabase(db);
        res.json({ notification: db.notifications[index], success: true });
    } catch (error) {
        console.error('Update notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete notification (admin only) - FIFTH
app.delete('/api/notifications/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db.notifications) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        const index = db.notifications.findIndex(n => n.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        db.notifications.splice(index, 1);
        await writeDatabase(db);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark notification as read (for individual users - stores in session/localStorage) - LAST
app.post('/api/notifications/:id/read', async (req, res) => {
    try {
        // This just returns success - read status is handled client-side
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Settings Routes
app.get('/api/settings', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.settings);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/settings', requireRole(['superadmin']), async (req, res) => {
    try {
        const db = await readDatabase();
        db.settings = { ...db.settings, ...req.body };
        await writeDatabase(db);
        res.json(db.settings);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// ===== Start Server =====
async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Manipur State Archives server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Database: ${DB_FILE}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();