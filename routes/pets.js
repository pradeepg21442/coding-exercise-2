const express = require('express');
const Joi = require('@hapi/joi');

const Pet = require('../models/pets');
const {validateBody} = require('../middlewares/route');

const router = express.Router();

router.get(
    '/',
    async (req, res, next) => {
        try {
            let result = await Pet.find();
            res.status(200).send(result);
        } catch (e) {
            next(e);
        }
    }
);

router.post(
    '/',
    validateBody(Joi.object().keys({
            name: Joi.string().required().description('Users first name'),
            age: Joi.number().integer().required().description('Users age'),
            colour: Joi.string().required().description('Users last name'),
        }),
        {
            stripUnknown: true,
        }),
    async (req, res, next) => {
        try {
            const pet = new Pet(req.body);
            await pet.save();
            res.status(201).json(pet);
        } catch (e) {
            next(e);
        }
    }
);

router.delete(
    '/:id',
    async (req, res, next) => {
        try {
            await Pet.findByIdAndRemove(req.params.id);
            res.status(200).send({message: 'record deleted successfully', id: req.params.id});
        } catch (e) {
            next(e);
        }
    }
);


module.exports = router;