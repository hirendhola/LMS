// checkIfUserExists.middleware.js
const Student = require('../models/Student');

module.exports = async (req, res, next) => {
    const { enrollmentNumber } = req.body;

    try {
        const existingUser = await Student.findOne({ enrollmentNumber });
        req.exists = !!existingUser;
        req.id = existingUser ? existingUser._id : null
        req.user = existingUser;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking Student existence' });
    }
};
