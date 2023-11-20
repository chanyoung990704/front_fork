const express = require('express');
const path = require('path');
const app = express();

// React 빌드 폴더 제공
app.use(express.static(path.join(__dirname, 'build')));

// 모든 요청을 React 애플리케이션으로 리디렉션
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
