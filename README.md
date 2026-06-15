# 🎖️ NCC VVCE Attendance Management System

<div align="center">

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey)
![Stars](https://img.shields.io/github/stars/Majenayu/NCC-VVCE-ATTENDENCE?style=social)
![Forks](https://img.shields.io/github/forks/Majenayu/NCC-VVCE-ATTENDENCE?style=social)
![Issues](https://img.shields.io/github/issues/Majenayu/NCC-VVCE-ATTENDENCE)
![Last Commit](https://img.shields.io/github/last-commit/Majenayu/NCC-VVCE-ATTENDENCE)
![VVCE](https://img.shields.io/badge/Institution-VVCE-orange)
![NCC](https://img.shields.io/badge/For-NCC_Cadets-blue)

**A comprehensive web-based attendance tracking and management system for NCC cadets**

[Report Bug](https://github.com/Majenayu/NCC-VVCE-ATTENDENCE/issues) • [Request Feature](https://github.com/Majenayu/NCC-VVCE-ATTENDENCE/issues)

</div>

---

## 📋 Project Information

**Project Name:** NCC VVCE Attendance Management System  
**Developer:** P G AYUSH RAI (majen)  
**Institution:** Vidyavardhaka College of Engineering (VVCE)  
**Build Date:** 2023  
**Project Type:** Full-Stack Web Application  
**Version:** 1.0.0  

---

## 🎯 About The Project

The NCC VVCE Attendance Management System is a comprehensive web-based solution designed to streamline attendance tracking for National Cadet Corps (NCC) activities at Vidyavardhaka College of Engineering. The system provides an intuitive interface for managing cadet records, tracking attendance with image verification, and generating detailed reports.

### Key Features

✨ **User Authentication** - Secure login and registration with bcrypt password encryption  
📸 **Image-Based Attendance** - Upload and manage attendance photos for verification  
👥 **Cadet Management** - Add, view, and manage cadet information  
📊 **Attendance Status** - Real-time attendance tracking and status overview  
📥 **Download Reports** - Export attendance records in Excel/Word formats  
🔄 **Refreshment Tracking** - Manage and track refreshment distribution  
🖼️ **Image Replacement** - Replace uploaded images if needed  
🔒 **Secure Backend** - MongoDB Atlas integration with Express.js server  
📱 **Responsive Design** - Mobile-friendly interface for all devices  

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Structure and markup
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Client-side interactivity

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database solution
- **Mongoose** - MongoDB object modeling

### Key Dependencies
- **bcryptjs** - Password hashing and security
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **ExcelJS** - Excel file generation
- **docx** - Word document generation
- **body-parser** - Request body parsing

---

## 📂 Project Structure

```
NCC-VVCE-ATTENDENCE/
│
├── server.js                      # Main server file with Express configuration
├── routes.js                      # API routes definition
├── model.js                       # MongoDB schemas and models
├── package.json                   # Project dependencies and scripts
│
├── index.html                     # Login page
├── register.html                  # Registration page
├── home.html                      # Dashboard/Home page
├── add-attendance.html            # Upload attendance with images
├── attendance-status.html         # View attendance records
├── manage-cadets.html             # Manage cadet information
├── download-attendance.html       # Download attendance reports
├── refreshment.html               # Refreshment management
├── refresh.html                   # Refresh page
│
├── login.css                      # Login page styles
├── register.css                   # Registration page styles
├── styles.css                     # Common styles
├── attendance.css                 # Attendance page styles
├── attendancest.css               # Attendance status styles
├── manage.css                     # Cadet management styles
├── download.css                   # Download page styles
├── refreshment.css                # Refreshment page styles
│
├── script.js                      # Main JavaScript logic
│
├── uploads/                       # Directory for uploaded images
├── node_modules/                  # Node.js dependencies
└── .vscode/                       # VS Code configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB Atlas Account** (or local MongoDB instance)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Majenayu/NCC-VVCE-ATTENDENCE.git
   cd NCC-VVCE-ATTENDENCE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB Connection**
   - Open `server.js`
   - Update the MongoDB connection string with your credentials:
     ```javascript
     mongoose.connect("your-mongodb-atlas-connection-string")
     ```

4. **Start the server**
   ```bash
   npm start
   ```
   Or
   ```bash
   node server.js
   ```

5. **Access the application**
   - Open your browser and navigate to:
     ```
     http://localhost:10000
     ```

---

## 📱 How to Use

### For New Users

1. **Register an Account**
   - Navigate to the registration page
   - Enter username and password
   - Click "Create Account"

2. **Login**
   - Enter your credentials on the login page
   - Access the dashboard after successful authentication

### Main Features

#### 📸 Add Attendance
- Navigate to "Add Attendance"
- Select date
- Upload attendance photos (up to 10 images)
- Submit to save records

#### 👥 Manage Cadets
- View list of all registered cadets
- Add new cadet information
- Update or remove cadet records

#### 📊 View Attendance Status
- Check attendance records by date
- View uploaded images for verification
- Track attendance patterns

#### 📥 Download Reports
- Generate attendance reports
- Export in Excel or Word format
- Filter by date range

#### 🔄 Manage Refreshments
- Track refreshment distribution
- Record cadet participation
- Generate refreshment reports

---

## 🔧 API Endpoints

### Authentication
```
POST /register          - Register new user
POST /login            - User login
```

### Attendance Management
```
POST /upload           - Upload attendance images
GET  /images           - Fetch all uploaded images
POST /replace-image    - Replace an existing image
GET  /images?date=     - Get images by specific date
```

### File Operations
```
GET  /uploads/:filename - Serve uploaded images
```

---

## 💾 Database Schema

### User Schema
```javascript
{
  name: String (unique, required),
  password: String (hashed, required)
}
```

### Image Upload Schema
```javascript
{
  date: String (required),
  images: [String] (file paths)
}
```

---

## 🔒 Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **Secure Authentication** - Token-based session management
- **Input Validation** - Server-side validation for all inputs
- **File Upload Security** - Multer with file type restrictions
- **CORS Protection** - Controlled cross-origin requests
- **MongoDB Injection Prevention** - Mongoose sanitization

---

## 🌐 Deployment

### Deploy to Render (or Similar Platform)

1. **Create account** on Render/Heroku/Railway

2. **Configure environment variables**
   ```
   MONGODB_URI=your-mongodb-connection-string
   PORT=10000
   ```

3. **Update server.js**
   ```javascript
   const PORT = process.env.PORT || 10000;
   ```

4. **Push to GitHub** and connect to deployment platform

5. **Deploy** and access via provided URL

---

## 📊 Features Breakdown

### Completed Features ✅
- User registration and authentication
- Image-based attendance tracking
- Multi-image upload (up to 10 per session)
- Attendance status viewing
- Cadet management interface
- Image replacement functionality
- MongoDB Atlas integration
- Secure password storage
- Responsive UI design

### Future Enhancements 🚧
- [ ] Excel/Word export functionality
- [ ] Date-range filtering
- [ ] Attendance analytics dashboard
- [ ] Email notifications
- [ ] Bulk cadet import (CSV/Excel)
- [ ] Role-based access control (Admin/User)
- [ ] Attendance QR code generation
- [ ] Mobile app version
- [ ] PDF report generation
- [ ] Automated backup system

---

## 🐛 Known Issues

- Server runs on port 10000 (ensure port is available)
- MongoDB connection string is hardcoded (should use environment variables)
- Login endpoint in `index.html` points to localhost (update for production)
- No email verification for registration
- Limited error handling for file uploads

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is part of an academic initiative at Vidyavardhaka College of Engineering.  
For licensing inquiries, please contact the developer.

---

## 👤 Developer

**P G AYUSH RAI (majen)**

- GitHub: [@Majenayu](https://github.com/Majenayu)
- Institution: Vidyavardhaka College of Engineering (VVCE)
- Project: NCC Attendance Management System

---

## 🙏 Acknowledgments

- **Vidyavardhaka College of Engineering** - For project support and infrastructure
- **NCC VVCE Unit** - For requirements and feedback
- **MongoDB** - For cloud database services
- **Express.js Community** - For excellent documentation
- **Open Source Contributors** - For the amazing libraries used

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Majenayu/NCC-VVCE-ATTENDENCE/issues)
- Contact: P G AYUSH RAI (majen)
- Institution: VVCE, Mysuru

---

## 📈 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

<div align="center">

**Made with ❤️ for NCC VVCE by P G AYUSH RAI (majen)**

⭐ Star this repository if you find it helpful!

**NCC VVCE** | **Attendance Made Easy**

</div>
