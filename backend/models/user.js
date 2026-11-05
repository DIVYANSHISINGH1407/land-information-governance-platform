
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Counter = require('./Counter');


const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    role: {
        type: String,
        enum: ["public", "government"],
        required: true
    },

    governmentId: {
        type: String,
        unique: true,
        sparse: true,
        immutable: true
    }

}, {
    timestamps: true
});


userSchema.pre('save', async function () {

    if (this.role !== 'government' || !this.isNew) {
        return;
    }

    const counter = await Counter.findByIdAndUpdate(
        'governmentId',
        { $inc: { sequence: 1 } },
        { returnDocument: 'after', upsert: true }
    );

    this.governmentId = `GOV-${String(counter.sequence).padStart(6, '0')}`;
});


userSchema.pre('save', async function () {
    
    
    if (!this.isModified('password')) {
        return;
    }
    
    this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
