// // checkIfUserExists.middleware.js
// const Student = require('../models/Student');

// module.exports = async (req, res, next) => {
//     const { email } = req.body;

//     try {
//         const existingUser = await Student.findOne({ email });
//         req.exists = !!existingUser;
//         req.id = existingUser ? existingUser._id : null
//         req.user = existingUser;
//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error checking User existence' });
//     }
// };

// checkIfUserExists.middleware.js
const Student = require('../models/Student');
const Admin = require('../models/Admin'); 

module.exports = (model) => async (req, res, next) => {
    const { email } = req.body;

    try {
        let existingUser;
        switch (model) {
            case 'Student':
                existingUser = await Student.findOne({ email });
                break;
            case 'Admin':
                existingUser = await Admin.findOne({ email });
                break;
            default:
                throw new Error('Invalid user model');
        }

        req.exists = !!existingUser;
        req.id = existingUser ? existingUser._id : null;
        req.user = existingUser;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking user existence' });
    }
};
