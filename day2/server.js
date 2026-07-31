const express = require('express')
const app= express()
app.use(express.json());

let products = [
  { id: 1, name: 'Product 1', price: 10.99 },
  { id: 2, name: 'Product 2', price: 19.99 },
  { id: 3, name: 'Product 3', price: 5.99 },
];

app.get('/PRODUCTS', (req, res) => {
  res.send(products);
});

app.get('/PRODUCTS/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send('Product not found');
  }
});

app.post('/PRODUCTS', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
  };
  products.push(newProduct);
  res.status(201).send(newProduct);
});

app.put('/PRODUCTS/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
    if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    res.send(product);
  }
    else {
    res.status(404).send('Product not found');
    }
})

app.delete('/PRODUCTS/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.send('Product deleted');
    }
    else {
        res.status(404).send('Product not found');
    }
  })


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});