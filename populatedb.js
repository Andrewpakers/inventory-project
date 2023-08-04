#! /usr/bin/env node

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
    await createGenres();
    await createArtists();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function genreCreate(index, name, description) {
    const genre = new Genre({ name: name, description: description });
    await genre.save();
    genres[index] = genre;
    console.log(`Added genre: ${name}`);
  }
  
  async function artistCreate(index, stage_name, first_name, family_name, active, genre) {
    const artistdetail = { stage_name: stage_name, first_name: first_name, family_name: family_name, active: active, genre: genre };
  
    const artist = new Artist(artistdetail);
  
    await artist.save();
    artists[index] = artist;
    console.log(`Added artist: ${stage_name}`);
  }
  
  async function itemCreate(index, name, description, artist, price, release_date, quantity, genre) {
    const itemdetail = {
      name: name,
      description: description,
      artist: artist,
      price: price,
      release_date: release_date,
      quantity: quantity,
      genre: genre,
    };
  
    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name} by ${artist.stage_name}`);
  }
  
  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate(0, "Jazz", "Jazz is a music genre that originated in the African-American communities of New Orleans, Louisiana, in the late 19th and early 20th centuries, with its roots in blues and ragtime. Since the 1920s Jazz Age, it has been recognized as a major form of musical expression in traditional and popular music."),
      genreCreate(1, "Hip Hop", "Hip hop or hip-hop, also known as rap and formerly known as disco rap, is a genre of popular music that was originated in the Bronx borough of New York City in the early 1970s by African Americans, having existed for several years prior to mainstream discovery."),
      genreCreate(2, "Country", "Country is a music genre originating in the Southern and Southwestern United States. First produced in the 1920s, Country music primarily focuses on working class Americans and blue-collar American life."),
      genreCreate(3, "Rock", "Rock music is a broad genre of popular music that originated as 'rock and roll' in the United States in the early 1950s, and developed into a range of different styles in the 1960s and later, particularly in the United States and the United Kingdom."),
      genreCreate(4, "Pop", "Pop music is a genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom. The terms popular music and pop music are often used interchangeably, although the former describes all music that is popular and includes many disparate styles."),
      genreCreate(5, "Classical", "Classical music is art music produced or rooted in the traditions of Western culture, including both liturgical (religious) and secular music. While a more precise term is also used to refer to the period from 1750 to 1820 (the Classical period), this article is about the broad span of time from before the 6th century AD to the present day, which includes the Classical period and various other periods."),
      genreCreate(6, "Electronic", "Electronic music is music that employs electronic musical instruments, digital instruments, or circuitry-based music technology in its creation. It includes both music made using electronic and electromechanical means (electroacoustic music)."),
      genreCreate(7, "Folk", "Folk music includes traditional folk music and the genre that evolved from it during the 20th-century folk revival. Some types of folk music may be called world music. Traditional folk music has been defined in several ways: as music transmitted orally, music with unknown composers, or music performed by custom over a long period of time."),
      genreCreate(8, "Blues", "Blues is a music genre and musical form which was originated in the Deep South of the United States around the 1860s by African-Americans from roots in African-American work songs, and spirituals. Blues incorporated spirituals, work songs, field hollers, shouts, chants, and rhymed simple narrative ballads."),
      genreCreate(9, "Metal", "Heavy metal (or simply metal) is a genre of rock music that developed in the late 1960s and early 1970s, largely in the United Kingdom and the United States. With roots in blues rock, psychedelic rock, and acid rock, heavy metal bands developed a thick, massive sound, characterized by distortion, extended guitar solos, emphatic beats, and loudness."),
      genreCreate(10, "Punk", "Punk rock (or simply punk) is a music genre that emerged in the mid-1970s. Rooted in 1960s garage rock, punk bands rejected the perceived excesses of mainstream 1970s rock. They typically produced short, fast-paced songs with hard-edged melodies and singing styles, stripped-down instrumentation, and often political, anti-establishment lyrics."),
      genreCreate(11, "Reggae", "Reggae is a music genre that originated in Jamaica in the late 1960s. The term also denotes the modern popular music of Jamaica and its diaspora. A 1968 single by Toots and the Maytals, 'Do the Reggay' was the first popular song to use the word 'reggae', effectively naming the genre and introducing it to a global audience."),
    ]);
  }
  
  async function createArtists() {
    console.log("Adding artists");
    await Promise.all([
      artistCreate(0, "Miles Davis", "Miles", "Davis", true, [genres[0]]),
      artistCreate(1, "Kendrick Lamar", "Kendrick", "Lamar", true, [genres[1]]),
      artistCreate(2, "Johnny Cash", "Johnny", "Cash", false, [genres[2]]),
      artistCreate(3, "The Beatles", false, false, false, [genres[3]]),
      artistCreate(4, "Michael Jackson", "Michael", "Jackson", false, [genres[4]]),
      artistCreate(5, "Johann Sebastian Bach", "Johann", "Bach", false, [genres[5]]),
      artistCreate(6, "Daft Punk", false, false, true, [genres[6]]),
      artistCreate(7, "Bob Dylan", "Bob", "Dylan", true, [genres[7]]),
      artistCreate(8, "B.B. King", "B.B.", "King", false, [genres[8]]),
      artistCreate(9, "Metallica", false, false, true, [genres[9]]),
      artistCreate(10, "The Ramones", false, false, false, [genres[10]]),
      artistCreate(11, "Bob Marley", "Bob", "Marley", false, [genres[11]]),
    ]);
  }

  async function createItems() {
    console.log("Adding items");
    await Promise.all([
      itemCreate(0, "Kind of Blue", "Kind of Blue is a studio album by American jazz trumpeter Miles Davis. It was recorded on March 2 and April 22, 1959, at Columbia's 30th Street Studio in New York City, and released on August 17 of that year by Columbia Records. The album features Davis's ensemble sextet consisting of saxophonists John Coltrane and Julian 'Cannonball' Adderley, pianist Bill Evans, bassist Paul Chambers, and drummer Jimmy Cobb, with new band pianist Wynton Kelly appearing on one track in place of Evans. After the entry of Evans into his sextet, Davis followed up on the modal experimentations of Milestones (1958) and 1958 Miles (1958) by basing the album entirely on modality, in contrast to his earlier work with the hard bop style of jazz. Though precise figures have been disputed, Kind of Blue has been described by many music writers not only as Davis's best-selling album, but as the best-selling jazz record of all time.", artists[0], 9.99, "1959-08-17", 100, [genres[0]]),
      itemCreate(1, "To Pimp a Butterfly", "To Pimp a Butterfly is the third studio album by American rapper Kendrick Lamar. It was released on March 15, 2015, by Top Dawg Entertainment, distributed by Aftermath Entertainment and Interscope Records. The album was recorded in studios throughout the United States, with production from Sounwave, Terrace Martin, Taz 'Tisa' Arnold, Thundercat, Rahki, LoveDragon, Flying Lotus, Pharrell Williams, Boi-1da, and several other high-profile hip hop producers, as well as executive production from Dr. Dre and Anthony 'Top Dawg' Tiffith. The album incorporates elements of free jazz, funk, soul, spoken word, and the avant-garde, and explores a variety of political and personal themes concerning African-American culture, racial inequality, depression, and institutional discrimination.", artists[1], 9.99, "2015-03-15", 100, [genres[1]]),
      itemCreate(2, "At Folsom Prison", "At Folsom Prison is a live album and 27th overall album by Johnny Cash, released on Columbia Records in May 1968. After his 1955 song 'Folsom Prison Blues', Cash had been interested in recording a performance at a prison. His idea was put on hold until 1967, when personnel changes at Columbia Records put Bob Johnston in charge of producing Cash's material. Cash had recently controlled his drug abuse problems, and was looking to turn his career around after several years of limited commercial success. Backed with June Carter, Carl Perkins and the Tennessee Three, Cash performed two shows at Folsom State Prison in California on January 13, 1968. The resulting album consisted of fifteen tracks from the first show and two tracks from the second.", artists[2], 9.99, "1968-05-01", 100, [genres[2]]),
      itemCreate(3, "Abbey Road", "Abbey Road is the eleventh studio album by the English rock band the Beatles, released on 26 September 1969 by Apple Records. Named after the location of EMI Studios in London, the cover features the group walking across the street's zebra crossing, an image that became one of the most famous and imitated in popular music. The album's initially mixed reviews were contrasted by its immediate commercial success, topping record charts in the UK and US. The lead single 'Something' / 'Come Together' was released in October and topped the US charts.", artists[3], 9.99, "1969-09-26", 100, [genres[3]]),
      itemCreate(4, "Thriller", "Thriller is the sixth studio album by American singer Michael Jackson, released on November 30, 1982 by Epic Records. Reunited with Off the Wall producer Quincy Jones, Jackson was inspired to create an album where 'every song was a killer'. With the ongoing backlash against disco, Jackson moved in a new musical direction, incorporating pop, post-disco, rock and funk. Thriller foreshadows the contradictory themes of Jackson's personal life, as he began using a motif of paranoia and darker themes. The album features a single guest appearance, with Paul McCartney becoming the first artist to be featured on Jackson's albums.", artists[4], 9.99, "1982-11-30", 100, [genres[4]]),
      itemCreate(5, "The Well-Tempered Clavier", "The Well-Tempered Clavier, BWV 846–893, is a collection of two sets of preludes and fugues in all 24 major and minor keys, composed for solo keyboard by Johann Sebastian Bach. In Bach's time Clavier was a generic name indicating a variety of keyboard instruments, most typically a harpsichord or clavichord – but not excluding an organ. The modern German spelling for the collection is Das wohltemperierte Klavier (WTK). Bach gave the title Das Wohltemperirte Clavier to a book of preludes and fugues in all 24 major and minor keys, dated 1722, composed 'for the profit and use of musical youth desirous of learning, and especially for the pastime of those already skilled in this study'. Bach later compiled a second book of the same kind, dated 1742, but titled it only Twenty-four Preludes and Fugues. The two works are now considered to comprise a single work, The Well-Tempered Clavier, or 'the 48', with the original WTC I referred to as 'the 24'.", artists[5], 9.99, "1722-07-28", 100, [genres[5]]),
      itemCreate(6, "Random Access Memories", "Random Access Memories is the fourth studio album by French electronic duo Daft Punk, released on 17 May 2013 by Daft Life and Columbia Records. The album pays tribute to late 1970s and early 1980s American music, particularly from Los Angeles. This theme is reflected in the album's packaging, as well as its promotional campaign, which included billboards, television advertisements, and a web series. Recording took place at Henson Recording Studios, Conway Recording Studios and Capitol Studios in California, Electric Lady Studios in New York City, and Gang Recording Studio in Paris, France.", artists[6], 9.99, "2013-05-17", 100, [genres[6]]),
      itemCreate(7, "Highway 61 Revisited", "Highway 61 Revisited is the sixth studio album by American singer-songwriter Bob Dylan, released on August 30, 1965 by Columbia Records. Having until then recorded mostly acoustic music, Dylan used rock musicians as his backing band on every track of the album, except for the closing track, the 11-minute ballad 'Desolation Row'. Critics have focused on the innovative way Dylan combined driving, blues-based music with the subtlety of poetry to create songs that captured the political and cultural chaos of contemporary America. Author Michael Gray has argued that, in an important sense, the 1960s 'started' with this album.", artists[7], 9.99, "1965-08-30", 100, [genres[7]]),
      itemCreate(8, "Live at the Regal", "Live at the Regal is a 1965 live album by American blues guitarist and singer B.B. King. It was recorded on November 21, 1964 at the Regal Theater in Chicago. The album is widely heralded as one of the greatest blues albums ever recorded and is #141 on Rolling Stone's 500 Greatest Albums of All Time. In 2005, Live at the Regal was selected for permanent preservation in the National Recording Registry at the Library of Congress in the United States.", artists[8], 9.99, "1965-11-21", 100, [genres[8]]),
      itemCreate(9, "Master of Puppets", "Master of Puppets is the third studio album by American heavy metal band Metallica, released on March 3, 1986, by Elektra Records. Recorded in Denmark at Sweet Silence Studios with producer Flemming Rasmussen, it was the band's last album to feature bassist Cliff Burton, who died in a bus accident in Sweden during the album's promotional tour. The album's artwork, designed by Metallica and Peter Mensch and painted by Don Brautigam, depicts a cemetery field of white crosses tethered to strings, manipulated by a pair of hands in a blood-red sky. Master of Puppets was released to critical acclaim and has been included in several publications' best album lists. Its driving, virtuosic music and angry, political lyrics drew praise from critics outside the metal community. The album is considered the band's strongest effort of the period and is one of the most influential heavy metal albums.", artists[9], 9.99, "1986-03-03", 100, [genres[9]]),
      itemCreate(10, "Ramones", "Ramones is the debut studio album by American punk rock band Ramones, released on April 23, 1976 by Sire Records. Fields agreed and convinced Craig Leon to produce Ramones, and the band recorded a demo for prospective record labels. Leon persuaded Sire president Seymour Stein to listen to the band perform, and he later offered the band a recording contract. The Ramones began recording in January 1976, needing only seven days and $6,400 to record the album. They used similar sound-output techniques to those of the Beatles and used advanced production methods by Leon.", artists[10], 9.99, "1976-04-23", 100, [genres[10]]),
      itemCreate(11, "Soul Rebels", "Soul Rebels is the second studio album by the Wailers, their first album to be released outside Jamaica. The Wailers approached producer Lee 'Scratch' Perry in August 1970 to record an entire album, and the sessions took place at Randy's Recording Studio (from then it was Randy's Studio 17) in Kingston, Jamaica, until November. First issued in the UK by Trojan Records in December 1970, the album has since been re-released several times on several different labels. The album was recorded during the band's formation earlier in 1970, and included Peter Tosh and Bob Marley, who would leave the band shortly after the album's release. Bunny Wailer briefly left the band during the recording sessions, and appears on just one song, 'Soul Rebel'.", artists[11], 9.99, "1970-12-01", 100, [genres[11]]),
    ]);
  }