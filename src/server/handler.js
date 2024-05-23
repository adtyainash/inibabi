const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getData = require("../services/getData");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
  try {
    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image); // Ensure these variables are correct
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        id: id,
        result: label, // Ensure all necessary data is included
        suggestion: suggestion,
        createdAt: createdAt
    };

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data: data
    });

    response.code(201);
    return response;
} catch (error) {
    console.error('Error in postPredictHandler:', error);
    const response = h.response({
      status: 'error',
      message: 'Failed to store prediction data',
      error: error.message
    });
    response.code(500);
    return response;

    }
    }

async function getPredictHistoryHandler(request, h) {
    const data = await getData("\(default\)");

    const response = h.response({
        status: "success",
        data,
    });
    response.code(200)
    return response;
}

module.exports = { postPredictHandler, getPredictHistoryHandler };