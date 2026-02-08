// // Database setup script
// const { MongoClient } = require("mongodb")

// async function setupDatabase() {
//   const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mahadev-baby-shop"
//   const client = new MongoClient(uri)

//   try {
//     await client.connect()
//     console.log("Connected to MongoDB")

//     const db = client.db()

//     // Create collections
//     const collections = ["users", "products", "orders", "reviews", "categories"]

//     for (const collectionName of collections) {
//       try {
//         await db.createCollection(collectionName)
//         console.log(`Created collection: ${collectionName}`)
//       } catch (error) {
//         console.log(`Collection ${collectionName} already exists`)
//       }
//     }

//     // Insert sample data
//     await insertSampleData(db)

//     console.log("Database setup completed successfully!")
//   } catch (error) {
//     console.error("Database setup failed:", error)
//   } finally {
//     await client.close()
//   }
// }

// async function insertSampleData(db) {
//   // Sample categories
//   const categories = [
//     { name: "Clothing", description: "Baby clothes and apparel" },
//     { name: "Accessories", description: "Baby accessories and essentials" },
//     { name: "Toys", description: "Safe and fun toys for babies" },
//     { name: "Feeding", description: "Feeding bottles and accessories" },
//   ]

//   await db.collection("categories").insertMany(categories)
//   console.log("Inserted sample categories")

//   // Sample admin user
//   const bcrypt = require("bcryptjs")
//   const adminUser = {
//     name: "Admin User",
//     email: "admin@mahadevbabyshop.com",
//     password: await bcrypt.hash("admin123", 10),
//     role: "admin",
//     phone: "+91-9876543210",
//     createdAt: new Date(),
//     isActive: true,
//   }

//   await db.collection("users").insertOne(adminUser)
//   console.log("Created admin user")
// }

// // Run the setup
// setupDatabase()



//C:\Users\UDAYN\Downloads\Projects\mahadev-baby\scripts\setup-database.js
const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function setupDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mahadev_baby_shop"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    // console.log("Connected to MongoDB")

    const db = client.db()

    // Create collections
    const collections = ["users", "products", "orders", "reviews", "categories", "otps", "notify_requests"]

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        // console.log(`Created collection: ${collectionName}`)
      } catch (error) {
        // console.log(`Collection ${collectionName} already exists`)
      }
    }

    // Insert sample data
    await insertSampleData(db)

    // console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Database setup failed:", error)
  } finally {
    await client.close()
  }
}

async function insertSampleData(db) {
  // Sample categories
  const categories = [
    { name: "Clothes", description: "Baby clothes and apparel", createdAt: new Date() },
    { name: "Toys", description: "Safe and fun toys for babies", createdAt: new Date() },
    { name: "New Born Baby Items", description: "Essential items for newborns", createdAt: new Date() },
  ]

  try {
    await db.collection("categories").insertMany(categories)
    // console.log("Inserted sample categories")
  } catch (error) {
    // console.log("Categories already exist")
  }

  // Sample products
  const sampleProducts = [
    {
      name: "Cute Baby Romper - Pink",
      description: "Soft cotton romper perfect for baby girls",
      price: 899,
      originalPrice: 1299,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "clothes",
      subcategory: "rompers",
      brand: "Mahadev Baby",
      ageRange: ["0-1 year", "1-2 years"],
      gender: "girl",
      size: ["0-3M", "3-6M", "6-9M"],
      color: ["Pink", "White"],
      material: "100% Cotton",
      stock: 25,
      minStock: 5,
      sku: "MBS-ROM-001",
      tags: ["romper", "cotton", "baby girl"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Baby Boy T-Shirt Set",
      description: "Comfortable t-shirt set for baby boys",
      price: 1299,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "clothes",
      subcategory: "t-shirts",
      brand: "Mahadev Baby",
      ageRange: ["1-2 years", "2-3 years"],
      gender: "boy",
      size: ["6-9M", "9-12M", "12-18M"],
      color: ["Blue", "Green"],
      material: "Cotton Blend",
      stock: 15,
      minStock: 3,
      sku: "MBS-TSH-001",
      tags: ["t-shirt", "baby boy", "set"],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Soft Plush Teddy Bear",
      description: "Safe and cuddly teddy bear for babies",
      price: 799,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "toys",
      brand: "Mahadev Toys",
      size: ["Small", "Medium"],
      color: ["Brown", "White"],
      stock: 30,
      minStock: 5,
      sku: "MBS-TOY-001",
      tags: ["teddy", "plush", "soft toy"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Himalaya Baby Shampoo",
      description: "Gentle shampoo for newborn babies",
      price: 299,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "newborn",
      subcategory: "shampoo",
      brand: "himalaya",
      size: ["50ml", "100ml", "200ml"],
      stock: 50,
      minStock: 10,
      sku: "MBS-SHA-001",
      tags: ["shampoo", "himalaya", "baby care"],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Baby Godali Set",
      description: "Traditional godali set for newborn ceremonies",
      price: 1999,
      images: ["/placeholder.svg?height=400&width=400"],
      category: "newborn",
      subcategory: "others",
      brand: "Mahadev Traditional",
      stock: 8,
      minStock: 2,
      sku: "MBS-GOD-001",
      tags: ["godali", "traditional", "ceremony"],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  try {
    await db.collection("products").insertMany(sampleProducts)
    // console.log("Inserted sample products")
  } catch (error) {
    // console.log("Products already exist")
  }

  // Sample regular user
  const regularUser = {
    name: "Test User",
    email: "user@test.com",
    phone: "+91-9876543210",
    password: await bcrypt.hash("password123", 12),
    isVerified: true,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    await db.collection("users").insertOne(regularUser)
    // console.log("Created test user")
  } catch (error) {
    // console.log("Test user already exists")
  }
}

// Run the setup
setupDatabase()
