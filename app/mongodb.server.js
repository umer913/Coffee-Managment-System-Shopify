import { MongoClient, ServerApiVersion } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB_NAME || "coffee_store";
const ordersCollectionName = "orders";

let mongoClientPromise;
let mongoSetupPromise;

function createMongoClient() {
  return new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}

function getMongoClientPromise() {
  if (!mongoUri) {
    return null;
  }

  if (!mongoClientPromise) {
    if (process.env.NODE_ENV !== "production") {
      if (!global.mongoClientPromise) {
        const client = createMongoClient();
        global.mongoClientPromise = client.connect();
      }

      mongoClientPromise = global.mongoClientPromise;
    } else {
      const client = createMongoClient();
      mongoClientPromise = client.connect();
    }
  }

  return mongoClientPromise;
}

const orderSchemaValidator = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "category",
      "item",
      "customerName",
      "address",
      "phoneNumber",
      "quantity",
      "unitPrice",
      "totalPrice",
      "unitPriceText",
      "totalPriceText",
      "status",
      "createdAt",
    ],
    properties: {
      category: {
        bsonType: "string",
        minLength: 1,
      },
      item: {
        bsonType: "string",
        minLength: 1,
      },
      customerName: {
        bsonType: "string",
        minLength: 1,
      },
      address: {
        bsonType: "string",
        minLength: 1,
      },
      phoneNumber: {
        bsonType: "string",
        minLength: 1,
      },
      quantity: {
        bsonType: ["int", "long", "double", "decimal"],
        minimum: 1,
      },
      unitPrice: {
        bsonType: ["int", "long", "double", "decimal"],
        minimum: 0,
      },
      totalPrice: {
        bsonType: ["int", "long", "double", "decimal"],
        minimum: 0,
      },
      unitPriceText: {
        bsonType: "string",
      },
      totalPriceText: {
        bsonType: "string",
      },
      status: {
        bsonType: "string",
      },
      createdAt: {
        bsonType: "date",
      },
    },
  },
};

export async function getMongoDb() {
  const clientPromise = getMongoClientPromise();

  if (!clientPromise) {
    return null;
  }

  const client = await clientPromise;
  return client.db(mongoDbName);
}

async function ensureOrdersCollection(db) {
  const existingCollection = await db
    .listCollections({ name: ordersCollectionName })
    .toArray();

  if (existingCollection.length === 0) {
    await db.createCollection(ordersCollectionName, {
      validator: orderSchemaValidator,
      validationLevel: "moderate",
    });
  } else {
    await db.command({
      collMod: ordersCollectionName,
      validator: orderSchemaValidator,
      validationLevel: "moderate",
    });
  }

  await db.collection(ordersCollectionName).createIndexes([
    {
      key: { createdAt: -1 },
      name: "createdAt_desc",
    },
    {
      key: { status: 1, createdAt: -1 },
      name: "status_createdAt_desc",
    },
  ]);
}

async function ensureMongoSetup(db) {
  if (!mongoSetupPromise) {
    mongoSetupPromise = (async () => {
      await db.command({ ping: 1 });
      await ensureOrdersCollection(db);
    })();
  }

  await mongoSetupPromise;
}

export async function saveOrderToMongo(orderData) {
  const db = await getMongoDb();

  if (!db) {
    return {
      saved: false,
      reason: "MongoDB is not configured. Add MONGODB_URI in the root .env file.",
    };
  }

  try {
    await ensureMongoSetup(db);
  } catch (error) {
    return {
      saved: false,
      reason:
        error instanceof Error
          ? `MongoDB setup failed: ${error.message}`
          : "MongoDB setup failed.",
    };
  }

  let result;

  try {
    result = await db.collection(ordersCollectionName).insertOne({
      ...orderData,
      createdAt: new Date(),
    });
  } catch (error) {
    return {
      saved: false,
      reason:
        error instanceof Error
          ? `MongoDB insert failed: ${error.message}`
          : "MongoDB insert failed.",
    };
  }

  return {
    saved: true,
    id: result.insertedId.toString(),
  };
}

export async function getRecentOrdersFromMongo(limit = 50) {
  const db = await getMongoDb();

  if (!db) {
    return {
      ok: false,
      reason: "MongoDB is not configured. Add MONGODB_URI in the root .env file.",
      orders: [],
    };
  }

  try {
    await ensureMongoSetup(db);
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error
          ? `MongoDB setup failed: ${error.message}`
          : "MongoDB setup failed.",
      orders: [],
    };
  }

  try {
    const orders = await db
      .collection(ordersCollectionName)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return {
      ok: true,
      orders: orders.map((order) => ({
        id: order._id?.toString?.() ?? "",
        category: order.category,
        item: order.item,
        customerName: order.customerName,
        address: order.address,
        phoneNumber: order.phoneNumber,
        quantity: order.quantity,
        unitPriceText: order.unitPriceText,
        totalPriceText: order.totalPriceText,
        status: order.status,
        createdAt: order.createdAt,
      })),
    };
  } catch (error) {
    return {
      ok: false,
      reason:
        error instanceof Error
          ? `MongoDB read failed: ${error.message}`
          : "MongoDB read failed.",
      orders: [],
    };
  }
}
