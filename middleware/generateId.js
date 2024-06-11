const uuid = require('uuid')
module.exports = generateId = () => {
  const id = uuid.v4().replace(/-/g, ''); // Hilangkan tanda "-"
  return id.slice(0, 21); // Ambil 21 karakter pertama
}
