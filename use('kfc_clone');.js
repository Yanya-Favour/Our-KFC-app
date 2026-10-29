use('kfc_clone');

// Clear out old mismatched cart rows to ensure a clean test
db.carts.drop();

// Perform a precise CREATE operation using your schema keys!
db.carts.insertOne({
  "title": "Veg Zinger Burger",
  "desc": "Signature veg burger with crispy patties, veggies & a tangy sauce",
  "price": "179.05",
  "image": "menu2.png",
  "qty": 1,
  "id": "12345"
});