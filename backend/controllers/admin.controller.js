const Admin = require('../models/Admin');
const Department = require('../models/Department');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.signup = async (req, res) => {
    const { name, email, password, department, role } = req.body;
    try {
        if (req.exists) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const hod = new Admin({
            name,
            email,
            password: hashedPassword,
            role
        });
        
        await hod.save()
        .then(hod => {
          const newDepartment = new Department({
            name: department, // Example department name
            hod: hod._id, // Associate the HOD with the department
          });
      
          // Save the Department to the database
          return newDepartment.save();
        })
        .then(department => {
          console.log('Department created with HOD:', department);
        })
        .catch(error => {
          console.error('Error creating department:', error);
        });
        res.status(201).json({
            message: "Signup successful",
            hod: {
                name,
                email,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Signup failed, please check your details.' });
    }
};

  
//login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!req.exists) {
            return res.status(404).json({
                message: 'Admin does not exist',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, req.user.password);

        if (isPasswordCorrect) {
            const accessToken = jwt.sign({
                id: req.id,
            }, process.env.JSONWENTOKEN_SIGN_SECRET, {
                expiresIn: "15s"
            });
            const refreshToken = jwt.sign({
                id: req.id,
            }, process.env.JSONWENTOKEN_REFRESH_SECRET, {
                expiresIn: "7d"
            });

            res.status(200).cookie("access_token", accessToken, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 15),
                httpOnly: true,
                sameSite: 'lax'
            }).cookie("refresh_token", refreshToken, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                httpOnly: true,
                sameSite: 'lax'
            }).json({ message: 'Login successful' });

        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.getAdmin = async (req, res) => {
    try {
        const hod = await Admin.findById(req.user.id, "-password");
        if (!hod) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json({ hod });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching admin' });
    }
};


exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is required.' });
    }

    jwt.verify(refreshToken, process.env.JSONWENTOKEN_REFRESH_SECRET, (err, Admin) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        }

        const accessToken = jwt.sign({ id: Admin.id }, process.env.JSONWENTOKEN_SIGN_SECRET, {
            expiresIn: "15s"
        });

        // Set the new access token in the response cookie
        res.cookie("access_token", accessToken, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 15),
            httpOnly: true,
            sameSite: 'lax'
        }).json({ message: 'Access token refreshed successfully' });
    });
}


exports.logout = (req, res) => {
    res.clearCookie("access_token", { path: '/' });
    res.clearCookie("refresh_token", { path: '/' });
    res.status(200).json({ message: 'Logout successful' });
};
