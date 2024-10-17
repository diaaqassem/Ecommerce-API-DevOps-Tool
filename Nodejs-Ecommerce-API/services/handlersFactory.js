const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

//  @desc   delete document by id
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    //  @desc  trigger "remove"  middleware when  removing a docuement
    await document.remove();
    res.status(204).send();
  });

//  @desc   update document by id
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const documentId = req.params.id;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    const document = await Model.findByIdAndUpdate(
      { _id: documentId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!document) {
      return next(new ApiError("document not found", 404));
    }

    //  @desc  tragger "save"  middleware when  updating a docuement
    await document.save();
    res
      .status(200)
      .json({ success: true, MSG: "document Updated", data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    } else if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const document = await Model.create(req.body);
    res.status(201).json(document);
  });

exports.getOne = (Model, populateOption) =>
  asyncHandler(async (req, res, next) => {
    const documentId = req.params.id;
    let query = Model.findById(documentId);
    if (populateOption) {
      query = query.populate(populateOption);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError("document not found", 404));
    }
    res.status(200).json({ success: true, data: document });
  });

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    //   //  for nested route
    //   const { categoryId, productId } = req.params;
    let filterObj = {};
    //   if (categoryId) {
    //     filterObj = { category: categoryId };
    //     req.filterObj = filterObj;
    //   }
    // if (productId) {
    //   filterObj = { product: productId };
    //   req.filterObj = filterObj;
    // }
    if (req.filterObj) {
      filterObj = req.filterObj;
    }
    const countDocs = await Model.countDocuments();
    //  @desc  build query
    const ApiFeature = new ApiFeatures(Model.find(filterObj), req.query)
      .sort()
      .filter()
      .paginate(countDocs)
      .search(modelName)
      .limitFields();
    //  @desc   excute query
    const { mongooseQuery, paginationResult } = ApiFeature;
    const documents = await mongooseQuery;
    if (documents.length === 0) {
      return next(new ApiError("documents not found", 404));
    }
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
