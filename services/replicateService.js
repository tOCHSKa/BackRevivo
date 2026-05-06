const Replicate = require("replicate");
require("dotenv").config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

exports.restoreImage = async (imageUrl) => {
  const output = await replicate.run(
    "sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2",
    {
      input: {
        image: imageUrl,
        upscale: 2,
        face_upsample: true,
        background_enhance: true,
        codeformer_fidelity: 0.1
      }
    }
  );

    return {
    url: extractUrl(output),
    raw: output
  };
};

function extractUrl(output) {
  if (!output) return null;

  if (typeof output === "string") return output;

  if (Array.isArray(output)) return extractUrl(output[0]);

  if (output?.url && typeof output.url === "function") {
    return output.url();
  }

  if (output?.url && typeof output.url === "string") {
    return output.url;
  }

  if (output?.output) return extractUrl(output.output);

  if (output instanceof URL) return output.toString();

  return null;
}
