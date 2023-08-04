console.log(
    'This script populates some test items (records), artists, and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Artist = require("./models/artist");
  const Item = require("./models/item");
  const Genre = require("./models/genre");
  
  const genres = [];
  const artists = [];
  const items = [];
  
  const mongoose = require("mongoose");
const genre = require("./models/genre");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await addImages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }

  async function addImageAlbum(id, imageFileName) {
    const item = await Item
        .findOne({ _id: id})
        .exec();
    item.image = "images/albums/" + imageFileName;
    await item.save();
    console.log(`Added image for ${item.name} by ${item.artist[0].stage_name}`)
  }

  async function addImages() {
    await addImageAlbum("64c814ac4c5407c1954e9844", "MilesDavisKindofBlue.jpg");
    await addImageAlbum("64c814ac4c5407c1954e9845", "PimpAButterfly.avif");
    await addImageAlbum("64c814ac4c5407c1954e9846", "Johnny_Cash_At_Folsom_Prison.jpg");
    await addImageAlbum("64c814ac4c5407c1954e9849", "bach.jpeg");
    await addImageAlbum("64c814ac4c5407c1954e9848", "Thriller.png");
    await addImageAlbum("64c814ac4c5407c1954e984a", "Random_Access_Memories.jpeg");
    await addImageAlbum("64c814ac4c5407c1954e984f", "SoulRebelsCDCover.jpg");
    await addImageAlbum("64c814ac4c5407c1954e984e", "Ramones_cover.jpeg");
    await addImageAlbum("64c814ac4c5407c1954e984d", "master_cover.jpg");
    await addImageAlbum("64c814ac4c5407c1954e984b", "Highway_61_Revisited.jpeg");
    await addImageAlbum("64c814ac4c5407c1954e984c", "live-regal.jpg");
  }
  