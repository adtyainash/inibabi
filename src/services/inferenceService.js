const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();

  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const confidenceScore = score[0] * 100;

  let label, explanation, suggestion;

  if (confidenceScore > 50) {
    label = 'Cancer';
    explanation = "Hasil prediksi menunjukkan kemungkinan adanya kanker. Kanker adalah penyakit yang ditandai dengan pertumbuhan sel-sel abnormal yang tidak terkendali di dalam tubuh.";
    suggestion = "Segera konsultasi dengan dokter untuk pemeriksaan lebih lanjut dan penanganan yang tepat.";
  } else {
    label = 'Non-cancer';
    explanation = "Hasil prediksi menunjukkan bahwa tidak terdeteksi adanya kanker. Namun, tetap jaga kesehatan dan lakukan pemeriksaan rutin.";
    suggestion = "Lakukan pemeriksaan kesehatan secara berkala untuk memastikan kondisi kesehatan yang optimal.";
  }

  return { confidenceScore, label, explanation, suggestion };
}

module.exports = predictClassification;
