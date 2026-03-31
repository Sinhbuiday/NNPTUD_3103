const mongoose = require('mongoose');
const app = require('./app');

// THAY THẾ CHUỖI NÀY BẰNG MONGODB URI CỦA BẠN (Ví dụ: mongodb://localhost:27017/messaging)
const MONGODB_URI = 'mongodb://127.0.0.1:27017/messaging_db';

const PORT = 5000;

mongoose.set('strictQuery', false);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Đã kết nối thành công tới MongoDB!');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log('Bạn có thể bắt đầu test trên Postman ngay bây giờ.');
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    console.log('Vui lòng kiểm tra xem MongoDB Compass đã được bật chưa.');
  });
