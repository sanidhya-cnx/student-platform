const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        // check if user already exists
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(201).json({
            message: "User registered successfully"
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            })
        }

        // generate token
        const token = jwt.sign(
            { id: user._id },
            "secretkey",
            { expiresIn: "7d" }
        )

        res.status(200).json({
            message: "Login successful",
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.userId).select("-password")

        res.status(200).json(user)

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

exports.updateProfile = async (req, res) => {

    try {

        const { name, bio, skills } = req.body

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, bio, skills },
            { new: true }
        ).select("-password")

        res.status(200).json(updatedUser)

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}