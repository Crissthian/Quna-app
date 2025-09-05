import User from "../models/user.js";
import { aj } from "../utils/arcjet.js";

const renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });

    const decision = await aj.protect(req, { userId: username, email });

    if (decision.isDenied()) {
      if (decision.reason.isEmail()) {
        req.flash("error", "Los correos temporales no están permitidos.");
      } else {
        req.flash("error", "No tienes permiso para registrarte.");
      }
      return res.redirect("/signup");
    } else {
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "¡Bienvenido a Quna!");
        res.redirect("/listings");
      });
    }
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

const renderLoginForm = (req, res) => {
  res.render("users/login");
};

const login = (req, res) => {
  req.flash("success", "Bienvenido de nuevo!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "¡Has cerrado sesión exitosamente!");
    res.redirect("/listings");
  });
};

const userProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("listings")
    .populate("reviews");

  const isOwner = req.user && req.user._id.equals(user._id);
  res.render("users/profile", { user, isOwner });
};

const publicProfile = async (req, res) => {
  const profileUser = await User.findById(req.params.id)
    .populate("listings")
    .populate("reviews");

  const isOwner = req.user && req.user._id.equals(profileUser._id);

  res.render("users/profile", { user: profileUser, isOwner });
};

export default {
  renderSignUpForm,
  signup,
  renderLoginForm,
  login,
  logout,
  userProfile,
  publicProfile,
};
