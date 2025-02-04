const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio.model');

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const portfolioItems = await Portfolio.find().sort({ createdAt: -1 });
    res.json(portfolioItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get portfolio item by ID
router.get('/:id', async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(portfolioItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new portfolio item
router.post('/', async (req, res) => {
  const portfolioItem = new Portfolio({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    projectUrl: req.body.projectUrl,
    technologies: req.body.technologies,
    category: req.body.category
  });

  try {
    const newPortfolioItem = await portfolioItem.save();
    res.status(201).json(newPortfolioItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update portfolio item
router.put('/:id', async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    Object.assign(portfolioItem, req.body);
    const updatedPortfolioItem = await portfolioItem.save();
    res.json(updatedPortfolioItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete portfolio item
router.delete('/:id', async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);
    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await portfolioItem.deleteOne();
    res.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
