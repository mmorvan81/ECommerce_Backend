const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags - be sure to include its associated Product data
  Tag.findAll({
    attributes:['tagName', 'ID'],
    include:[{model: Product, 
        attributes:['ID', 'categoryID', 'stock', 'price', 'productName']}]
  })
  .then(tagInfo=> response.json(tagInfo))
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });

router.get('/:id', (req, res) => {
  // find a single tag by its `id` - be sure to include its associated Product data
  Tag.findOne({
    where:{id: request.parameters.id},
    attributes:['tagName', 'ID'],
    include:[{model: Product, 
      attributes:['ID', 'categoryID', 'stock', 'price', 'productName']}]
  })
  .then(tagInfo=> {
    if(!tagInfo) {
      response.status(404).json ({message: 'no tag matches this id'});
      return;
    }
    response.json(tagInfo);
  })
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tagName: request.body.categoryName
  })
  .then(tagInfo=> response.json(tagInfo))
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(request.body, 
    {where:{id: request.parameters.id}
  })
  .then(tagInfo=> {
    if(!tagInfo) {
      response.status(400).json ({message: 'no tag matches this id'});
      return;
    }
    response.json(tagInfo);
  })
  .catch(error=>{console.log(error);
    response.status(500).json(error);
  });
  });


router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where:{id: request.parameters.id}
})
  .then(tagInfo=> {
    if(!tagInfo) {
      response.status(400).json ({message: 'no tag matches this id'});
      return;
  }
    response.json(tagInfo);
})
  .catch(error=>{console.log(error);
  response.status(500).json(error);
});
});

module.exports = router;
