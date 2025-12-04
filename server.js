const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/api/lesson', (req, res) => {
  res.json({
    lesson: "مرحبًا! هذا أول درس من مدرسة المنهاج: تعلّم التحيات بالإنجليزية. Hello! How are you?",
    teacherReply: "أنا معلمك الافتراضي من مدرسة المنهاج. كرر معي: 'Hello!', 'Good morning!', 'Nice to meet you!' 🌟"
  });
});

app.listen(PORT, () => {
  console.log(`✅ الخادم يعمل`);
});
