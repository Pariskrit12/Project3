import fs from "fs";

let nsfwModel = null;
let modelLoadPromise = null;

async function getModel() {
  if (nsfwModel) return nsfwModel;
  if (!modelLoadPromise) {
    modelLoadPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      await (tf.default || tf).setBackend("cpu");
      await (tf.default || tf).ready();
      const { load } = await import("nsfwjs");
      nsfwModel = { tf: tf.default || tf, classifier: await load() };
    })();
  }
  await modelLoadPromise;
  return nsfwModel;
}

/**
 * Classifies a local image file for NSFW content using nsfwjs.
 * Returns { flagged: bool }.
 * Skips non-image files (videos). Fails open on any error.
 *
 * @param {string} filePath - Path to the local temp image file (from multer)
 * @param {string} mimetype - File mimetype (e.g. "image/jpeg")
 */
export async function moderateImage(filePath, mimetype) {
  if (!mimetype || !mimetype.startsWith("image/")) return { flagged: false };

  try {
    const { tf, classifier } = await getModel();
    const { Jimp } = await import("jimp");

    const image = await Jimp.read(filePath);
    const { width, height } = image.bitmap;
    const rgbData = new Uint8Array(width * height * 3);
    let offset = 0;
    for (let i = 0; i < image.bitmap.data.length; i += 4) {
      rgbData[offset++] = image.bitmap.data[i];     
      rgbData[offset++] = image.bitmap.data[i + 1]; 
      rgbData[offset++] = image.bitmap.data[i + 2]; 
    }

    const tensor = tf.tensor3d(rgbData, [height, width, 3]);
    const predictions = await classifier.classify(tensor);
    tensor.dispose();

    const pornScore = predictions.find((p) => p.className === "Porn")?.probability ?? 0;
    const hentaiScore = predictions.find((p) => p.className === "Hentai")?.probability ?? 0;
    const sexyScore = predictions.find((p) => p.className === "Sexy")?.probability ?? 0;

    const flagged =
      pornScore > 0.85 ||
      hentaiScore > 0.85 ||
      (pornScore + hentaiScore + sexyScore * 0.5) > 1.4;

    return { flagged };
  } catch (err) {
    console.error("[imageModeration] Classification failed, allowing image through:", err.message);
    return { flagged: false };
  }
}
