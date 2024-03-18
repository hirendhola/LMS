const Student = require('../models/Student');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.signup = async (req, res) => {
    const { name, email, password, department, enrollmentNumber, role } = req.body;
    try {
        if (req.exists) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({
            name,
            email,
            password: hashedPassword,
            department,
            enrollmentNumber,
            role
        });
        await student.save();
        res.status(201).json({
            message: "Signup successful",
            student: {
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
                message: 'Student does not exist',
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

exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id, "-password");
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json({ student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching student' });
    }
};


exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is required.' });
    }

    jwt.verify(refreshToken, process.env.JSONWENTOKEN_REFRESH_SECRET, (err, Student) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        }

        const accessToken = jwt.sign({ id: Student.id }, process.env.JSONWENTOKEN_SIGN_SECRET, {
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
