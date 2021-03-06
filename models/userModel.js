const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            maxlength: [30, 'Username must be less or equal then 30 characters.'],
            minlength: [8, 'Username must be more or equal then 8 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid username. 
            Must be characters or number!`]
        },
        fName: {
            type: String,
            trim: true,
            maxlength: [20, 'FName must be less or equal then 20 characters.'],
            minlength: [8, 'FName must be more or equal then 8 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid FName. 
            Must be characters or number!`]
        },
        lName: {
            type: String,
            trim: true,
            maxlength: [20, 'LName must be less or equal then 20 characters.'],
            minlength: [8, 'LName must be more or equal then 8 characters.'],
            validate: [validator.isAlphanumeric, `Please provide valid LName. 
            Must be characters or number!`]
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female'],
                message: 'Gender is either: male or female'
            }
        },
        role: {
            type: String,
            enum: ['client', 'driver', 'admin'],
            default: 'client'
        },
        photoAvatar: {
            type: String,
            default: 'default.jpg'
        },
        photoAvatarExt: String,
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        nationality: String,
        licenseNo: {
            type: String
            // required: [true, 'Please provide a license no.']
        },
        cnicNo: {
            type: String
            // required: [true, 'Please provide a cnic.']
        },
        dob: Date,
        isActive: {
            type: Boolean,
            default: true,
            select: false
        },
        address: {
            type: String,
            trim: true,
            // required: [true, 'Please provide an address'],
            maxlength: [40, 'Address must be less or equal then 30 characters.'],
            minlength: [8, 'Address must be more or equal then 8 characters.']
        },
        postalCode: {
            type: String
            // validate: [validator.isPostalCodeLocales, 'Please provide valid postal code']
        },
        age: {
            type: Number,
            validate: {
                validator: function (val) {
                    return parseInt(val) > 15;
                }
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
const User = mongoose.model('User', userSchema);

module.exports = User;