import { signInService, signupService } from "../services/authService.js";

export const signUpController = async (req, res, next) => {
  try {
    const result = await signupService(req.body);
    res.status(201).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const signInController = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await signInService(req.body);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
    });
  } catch (error) {
    next(error);
  }
};
