const router = require('express').Router();
// const { request } = require('express');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products - be sure to include its associated Category and Tag data
  Product.findAll({
    attributes:['ID', 'categoryID', 'stock', 'price', 'productName'],
    include:[{model: Category, 
      attributes:['categoryName', 'ID']
  },
  {   model: Tag, 
    attributes:['categoryName', 'ID']
}]
  })
 .then(productInfo=> response.json(productInfo))
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id` - be sure to include its associated Category and Tag data
  Product.findOne({
    where:{id: request.parameters.id},
    attributes:['categoryName', 'ID'],
    include:[{model: Category, 
      attributes:['ID', 'categoryID', 'stock', 'price', 'productName']}]
  })
  .then(categoryInfo=> {
    if(!categoryInfo) {
      response.status(404).json ({message: 'no product matches this id'});
      return;
    }
    response.json(productInfo);
  })
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    Product.create(request.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (request.body.tagIds.length) {
        const productTagIdArray = request.body.tagIds.map((tag_id) => {
          return {
            productID: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArray);
      }
      // if no product tags, just respond
      response.status(200).json(product);
    })
    .then((productTagIds) => response.status(200).json(productTagIds))
    .catch((error) => {console.log(error);
      response.status(400).json(error);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(request.body, 
    {where:{id: request.parameters.id},
  })
  .then((product)=> {
   // find all associated tags from ProductTag
   return ProductTag.findAll({where:{productId: request.parameters.id}});
  })
   // get list of current tag_ids
  .then(
    (productTags)=> {
  const productTagIds = productTags.map(({tagId})=>tagId);
   // create filtered list of new tag_ids
  const newProductTags = request.body.tagIds
      .filter((tagId)=>!productTagIds.includes(tag_id))
      .map((tagId)=>{
        return {
        productId:request.parameters.id,
        tagId,
      };
    });
    // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tagId }) => !request.body.tagIds.includes(tagId))
        .map(({ id }) => id);

    // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
  
    .then((updatedProductTags) => ressponse.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      response.status(400).json(error);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where:{id: request.parameters.id}
})
  .then(productInfo=> {
    if(!productInfo) {
      response.status(400).json ({message: 'no product matches this id'});
      return;
  }
    response.json(productInfo);
})
  .catch(error=>{console.log(error);
  response.status(500).json(error);
});
});
module.exports = router;
