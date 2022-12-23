// const { MongoClient } = require('mongodb');
require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri = process.env.MONGO_URI

async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/drivers/node/ for more details
   */
  // const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/sample_airbnb?retryWrites=true&w=majority";

  /**
   * The Mongo Client you will use to interact with your database
   * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
   * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
   * pass option { useUnifiedTopology: true } to the MongoClient constructor.
   * const client =  new MongoClient(uri, {useUnifiedTopology: true})
   */
  const client = new MongoClient(uri)

  try {
    // Connect to the MongoDB cluster
    await client.connect()

    ///////////////   DB function calls

    // // Make the appropriate DB calls
    // Create
    // 1. Create one Record
    // await createListing(client,
    //     {
    //         name: "Lovely Loft",
    //         summary: "A charming loft in Paris",
    //         bedrooms: 1,
    //         bathrooms: 1
    //     }
    // );

    // await createMultipleListings(client, [
    //     {
    //         name: "Infinite Views",
    //         summary: "Modern home with infinite views from the infinity pool",
    //         property_type: "House",
    //         bedrooms: 5,
    //         bathrooms: 4.5,
    //         beds: 5
    //     },
    //     {
    //         name: "Private room in London",
    //         property_type: "Apartment",
    //         bedrooms: 1,
    //         bathroom: 1
    //     },
    //     {
    //         name: "Beautiful Beach House",
    //         summary: "Enjoy relaxed beach living in this house with a private beach",
    //         bedrooms: 4,
    //         bathrooms: 2.5,
    //         beds: 7,
    //         last_review: new Date()
    //     }
    // ]);
    // Retrieve (Find)
    // await findOneListingByName(client, "Infinite Views");

    // await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    //     minimumNumberOfBedrooms: 1,
    //     minimumNumberOfBathrooms: 1,
    //     maximumNumberOfResults        : 10
    // });

    //  Find

    // await  updateListingByName(client, "Infinite Views", { bedrooms: 6, beds:iiiiii 8 });

    // await upsertListingByName(client, "Cozy Cottage", { name: "Cozy Cottage", bedrooms: 2, bathrooms: 1 });

    // make changes to existing document
    // await upsertListingByName(client, "Cozy Cottage", { beds: 2 });

    // await updateAllListingsToHavePropertyType(client)

    //  Delete

    // await deleteListingByName(client, "Cozy Cottage");

    // await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));

    ///////////////   DB function calls   end //////////////////////////

    // Aggregations calls /////////////////////////////

    await printCheapestSuburbs(client, 'Australia', 'Sydney', '10')

    // Aggregations calls  end         /////////////////////////////
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close()
  }
}

main().catch(console.error)

// CRUD     ****** Aggregates below CRUD

// Create   //////////////////////////////////////////

// insertOne()

async function createListing(client, newListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .insertOne(newListing)
  console.log(`New listing created with the following id: ${result.insertedId}`)
}

// insertMany()

async function createMultipleListings(client, newListings) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .insertMany(newListings)

  console.log(
    `${result.insertedCount} new listing(s) created with the following id(s):`
  )
  console.log(result.insertedIds)
}

//    Retrieve   ///////////////////////////////////////

//   findOne()
async function findOneListingByName(client, nameOfListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .findOne({ name: nameOfListing })

  if (result) {
    console.log(
      `Found a listing in the collection with the name '${nameOfListing}':`
    )
    console.log(result)
  } else {
    console.log(`No listings found with the name '${nameOfListing}'`)
  }
}

// find()      find more than one

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(
  client,
  {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER,
  } = {}
) {
  const cursor = client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .find({
      bedrooms: { $gte: minimumNumberOfBedrooms },
      bathrooms: { $gte: minimumNumberOfBathrooms },
    })
    .sort({ last_review: -1 })
    .limit(maximumNumberOfResults)

  const results = await cursor.toArray()

  if (results.length > 0) {
    console.log(
      `Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`
    )
    results.forEach((result, i) => {
      date = new Date(result.last_review).toDateString()

      console.log()
      console.log(`${i + 1}. name: ${result.name}`)
      console.log(`   _id: ${result._id}`)
      console.log(`   bedrooms: ${result.bedrooms}`)
      console.log(`   bathrooms: ${result.bathrooms}`)
      console.log(
        `   most recent review date: ${new Date(
          result.last_review
        ).toDateString()}`
      )
    })
  } else {
    console.log(
      `No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`
    )
  }
}

// Update     ////////////////////////////////////////////////////
// updateOne()
// will update an existing record

async function updateListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .updateOne({ name: nameOfListing }, { $set: updatedListing })

  console.log(`${result.matchedCount} document(s) matched the query criteria.`)
  console.log(`${result.modifiedCount} document(s) was/were updated.`)
}

// upsert() Update or Insert if not existing

async function upsertListingByName(client, nameOfListing, updatedListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .updateOne(
      { name: nameOfListing },
      { $set: updatedListing },
      { upsert: true }
    )
  console.log(`${result.matchedCount} document(s) matched the query criteria.`)

  if (result.upsertedCount > 0) {
    console.log(
      `One document was inserted with the id ${result.upsertedId._id}`
    )
  } else {
    console.log(`${result.modifiedCount} document(s) was/were updated.`)
  }
}

async function updateAllListingsToHavePropertyType(client) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .updateMany(
      { property_type: { $exists: false } },
      { $set: { property_type: 'Unknown' } }
    )
  console.log(`${result.matchedCount} document(s) matched the query criteria.`)
  console.log(`${result.modifiedCount} document(s) was/were updated.`)
}

//    Delete   /////////////////////////////////////////////////////////////
// Delete One Document

async function deleteListingByName(client, nameOfListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .deleteOne({ name: nameOfListing })
  console.log(`${result.deletedCount} document(s) was/were deleted.`)
}

// Delete Many Document

async function deleteListingsScrapedBeforeDate(client, date) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .deleteMany({ last_scraped: { $lt: date } })
  console.log(`${result.deletedCount} document(s) was/were deleted.`)
}

// Aggregate Piplines   /////////////////////////
// pipline queries exported from Atlas Aggregator and inserted into the pipeline array

async function printCheapestSuburbs(client, country, market, maxNumberToPrint) {
  const pipeline = [
    
    
        {
          '$match': {
            'bedrooms': 1, 
            'address.country': 'Australia', 
            'address.market': 'Sydney', 
            'address.suburb': {
              '$exists': 1, 
              '$ne': ''
            }, 
            'room_type': 'Entire home/apt'
          }
        }, {
          '$group': {
            '_id': '$address.suburb', 
            'averagePrice': {
              '$avg': '$price'
            }
          }
        }, {
          '$sort': {
            'averagePrice': 1
          }
        }, {
          '$limit': 10
        }
      ]
    
  

  const aggCursor = client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .aggregate(pipeline)

  await aggCursor.forEach((airbnbListing) => {
    console.log(`${airbnbListing._id}: ${airbnbListing.averagePrice}`)
  })
}
