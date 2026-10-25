import { getAllUsers, getUserById as getUserByIdService } from '../services/userService.js'

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}