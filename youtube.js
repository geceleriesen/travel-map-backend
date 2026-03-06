const { resolveLocation } = require("./locationAI");

async function processVideos(videos) {

  return videos.map((video) => {

    const loc = resolveLocation(video);

    if (!loc) {

      video.location = "Unknown";
      video.lat = null;
      video.lng = null;

      return video;

    }

    video.location = loc.location;
    video.country = loc.country;
    video.lat = loc.lat;
    video.lng = loc.lng;

    return video;

  });

}

module.exports = {
  processVideos
};
