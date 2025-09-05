import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import DatauriParser from "datauri/parser.js";
import mongoose from "mongoose";
import path from "path";
import cloudinary from "../cloudConfig.js";
import Listing from "../models/listing.js";
import User from "../models/user.js";
const parser = new DatauriParser();
const { Schema, connect } = mongoose;

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const index = async (req, res) => {
  const { q } = req.query;
  let findQuery = {};
  if (q) {
    findQuery = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };
  }

  const allListings = await Listing.find(findQuery).populate("reviews");

  const listingsWithAvg = allListings.map((listing) => {
    let avg = 4.5;
    if (listing.reviews && listing.reviews.length > 0) {
      const sum = listing.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      avg = (sum / listing.reviews.length).toFixed(1);
    }
    return { ...listing.toObject(), avgRating: avg };
  });

  res.render("listings/index", { listings: listingsWithAvg, searchQuery: q });
};

const renderNewForm = (req, res) => {
  res.render("listings/new");
};

const showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author", model: "User" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "❌ Anuncio no encontrado");
    return res.redirect("/listings");
  }
  res.render("listings/show", {
    listing,
    mapToken: process.env.MAP_TOKEN,
  });
};

const createListing = async (req, res) => {
  if (!req.user) {
    req.flash("error", "¡Debes estar logueado para hacer eso!");
    return res.redirect("/login");
  }

  let response;
  try {
    response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing?.location,
        limit: 1,
      })
      .send();
  } catch (geoErr) {
    req.flash("error", "La búsqueda de ubicación falló. Inténtalo de nuevo.");
    return res.redirect("/listings/new");
  }

  if (!response.body.features.length) {
    req.flash("error", "Ubicación no válida. Inténtalo de nuevo.");
    return res.redirect("/listings/new");
  }

  if (!req.file) {
    req.flash("error", "Por favor, sube una imagen.");
    return res.redirect(req.get("referer") || "/listings/new");
  }

  try {
    const fileExt = path.extname(req.file.originalname).toString();
    const base64File = parser.format(fileExt, req.file.buffer).content;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "quna_DEV",
      resource_type: "image",
    });

    if (!result.secure_url) {
      throw new Error("Cloudinary did not return secure_url");
    }

    const newListing = new Listing({
      ...req.body.listing,
      geometry: response.body.features[0].geometry,
      image: { url: result.secure_url, filename: result.public_id },
      owner: req.user._id,
    });

    const savedListing = await newListing.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { listings: savedListing._id },
    });

    req.flash("success", "Nuevo anuncio creado correctamente!");
    return res.redirect(`/listings/${savedListing._id}`);
  } catch (error) {
    req.flash("error", `Fallo al crear el anuncio: ${error.message}`);
    return res.redirect("/listings/new");
  }
};

const updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing;

  let updatedListing = await Listing.findByIdAndUpdate(
    id,
    { ...listingData },
    { new: true }
  );

  if (req.file) {
    if (updatedListing.image?.filename) {
      await cloudinary.uploader.destroy(updatedListing.image.filename);
    }

    const base64File = parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;
    const result = await cloudinary.uploader.upload(base64File, {
      folder: "quna_DEV",
    });

    updatedListing.image = {
      url: result.secure_url,
      filename: result.public_id,
    };
    await updatedListing.save();
  }

  req.flash("success", "✏️ Lugar actualizado correctamente!");
  res.redirect(`/listings/${id}`);
};

const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "❌ Lugar no encontrado");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

const destroyListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (listing.image?.filename && listing.image.filename !== "default.jpg") {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "🗑️ Lugar eliminado correctamente!");
  res.redirect("/listings");
};

export default {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
};
