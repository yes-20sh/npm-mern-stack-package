import User from '../models/User.js'

export const getAllUsers = async () => {
  return await User.find()
}

export const getUserById = async (id) => {
  return await User.findById(id)
}
