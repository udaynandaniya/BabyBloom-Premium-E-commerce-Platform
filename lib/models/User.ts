

//C:\Users\UDAYN\Downloads\Projects\mahadev-baby - Copy\lib\models\User.ts
import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email?: string
  phone?: string
  password: string
  address?: {
    street: string
    area: string
    state: string
    district: string
    subDistrict: string
    village: string
    pincode: string
  }
  isVerified: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
    phone: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
    password: { type: String, required: true },
    address: {
      street: String,
      area: String,
      state: String,
      district: String,
      subDistrict: String,
      village: String,
      pincode: String,
    },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    // Remove any duplicate index definitions
  },
)

// // Ensure unique compound index for email/phone
// userSchema.index({ email: 1 }, { unique: true, sparse: true })
// userSchema.index({ phone: 1 }, { unique: true, sparse: true })

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

// const User = mongoose.models.User || mongoose.model("User", UserSchema)
// ✅ Named export added
export const UserModel = User

// ✅ Default export retained
export default User



// import mongoose, { Schema, type Document } from "mongoose"

// export interface IUser extends Document {
//   name: string
//   email?: string
//   phone?: string
//   password: string
//   address?: {
//     street: string
//     area: string
//     state: string
//     district: string
//     subDistrict: string
//     village: string
//     pincode: string
//   }
//   isVerified: boolean
//   role: "user" | "admin"
//   createdAt: Date
//   updatedAt: Date
// }

// const userSchema = new Schema<IUser>(
//   {
//     name: { type: String, required: true },
//     email: { type: String, unique: true, sparse: true },
//     phone: { type: String, unique: true, sparse: true },
//     password: { type: String, required: true },
//     address: {
//       street: String,
//       area: String,
//       state: String,
//       district: String,
//       subDistrict: String,
//       village: String,
//       pincode: String,
//     },
//     isVerified: { type: Boolean, default: false },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//   },
//   { timestamps: true }
// )

// const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

// export const UserModel = User
// export default User




