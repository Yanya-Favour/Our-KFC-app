use('kfc_clone');

// Clear out previous collections to guarantee a fresh record mount
db.menus.drop();

// Perform the clean local image string mapping matching your category tags exactly
db.menus.insertMany([
  {
    "title": "Veg Zinger Burger",
    "desc": "Signature veg burger with crispy patties, veggies & a tangy sauce",
    "price": "179.05",
    "image": "menu2.png",
    "type": "chicken"
  },
  {
    "title": "Bucket for Two",
    "desc": "Flat UGX 115 off on combo of 2pc Hot & Crispy, 2 pc Smoky Red Chicken & Large Popcorn",
    "price": "599.05",
    "image": "menu1.png",
    "type": "chicken"
  },
  {
    "title": "Single Roll Combo for 1",
    "desc": "Delicious chicken roll combo paired with golden crispy french fries.",
    "price": "340.00",
    "image": "menu4.png",
    "type": "burger"
  },
  {
    "title": "Large Fries",
    "desc": "Jazz up your meal with crispy, fluffy, perfectly salted golden large fries.",
    "price": "119.05",
    "image": "menu3.png",
    "type": "burger"
  }
]);