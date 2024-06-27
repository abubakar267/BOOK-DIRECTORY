const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        let pass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        pass = await bcrypt.hash(pass, salt);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: pass
        });

        const token = user.createJWT();
        res.status(StatusCodes.OK).json({
            user: {
                name: user.name,
                email: user.email,
                token
            }
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Registration failed', error });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }
        console.log('user exists');



        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }

        console.log('ppassword is correct');

        const token = user.createJWT();
        res.status(StatusCodes.OK).json({
            user: {
                name: user.name,
                email: user.email,
                token
            }
        });
        console.log(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Login failed', error });
    }
}

module.exports = {
    register,
    login
}
