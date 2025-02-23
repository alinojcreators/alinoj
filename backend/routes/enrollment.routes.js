const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollment.model');

// Create new enrollment
router.post('/', async (req, res) => {
    try {
        const enrollment = new Enrollment(req.body);
        await enrollment.save();
        res.status(201).json({
            success: true,
            data: enrollment,
            message: 'Enrollment successful'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all enrollments
router.get('/', async (req, res) => {
    try {
        const enrollments = await Enrollment.find();
        res.status(200).json({
            success: true,
            data: enrollments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get enrollment by ID
router.get('/:id', async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update enrollment status
router.patch('/:id', async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;