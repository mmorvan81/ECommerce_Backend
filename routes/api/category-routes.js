const router = require('express').Router();
// const { response } = require('express');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories - be sure to include its associated Products
Category.findAll({
  attributes:['categoryName', 'Id'],
  include:[{model: Product, 
      attributes:['Id', 'categoryId', 'stock', 'price', 'productName']}]
})
.then(categoryInfo=> response.json(categoryInfo))
.catch(error=>{console.log(error);
  response.status(500).json(error);
});
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value - be sure to include its associated Products
  Category.findOne({
    where:{Id: request.parameters.id},
    attributes:['categoryName', 'Id'],
    include:[{model: Product, 
      attributes:['Id', 'categoryId', 'stock', 'price', 'productName']}]
  })
  .then(categoryInfo=> {
    if(!categoryInfo) {
      response.status(404).json ({message: 'no category matches this Id'});
      return;
    }
    response.json(categoryInfo);
  })
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    categoryName: request.body.categoryName
  })
  .then(categoryInfo=> response.json(categoryInfo))
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });
  
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(request.body, 
    {where:{Id: request.parameters.id}
  })
  .then(categoryInfo=> {
    if(!categoryInfo) {
      response.status(400).json ({message: 'no category matches this id'});
      return;
    }
    response.json(categoryInfo);
  })
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where:{Id: request.parameters.id}
})
  .then(categoryInfo=> {
    if(!categoryInfo) {
      response.status(400).json ({message: 'no category matches this id'});
      return;
  }
    response.json(categoryInfo);
})
  .catch(error=>{console.log(error);
  response.status(500).json(error);
});
});
module.exports = router;
