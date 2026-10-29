use('kfc_clone');

// Injects a completely fresh item row parameters into your menus storage collection
db.menus.insertOne({
  "title": "Crunchy Chicken Strips",
  "desc": "4 pieces of hot and crispy boneless chicken breast strips.",
  "price": "250.00",
  "image": "menu3.png",
  "type": "chicken"
});