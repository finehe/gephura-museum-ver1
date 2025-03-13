const express = require('express');
const path = require('path');
const app = express();

// 设置静态文件目录
const staticPath = path.join(__dirname, 'unpackage/dist/build/web');
app.use(express.static(staticPath));

// 设置 CORS 头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 调试路由
app.get('/debug', (req, res) => {
  res.json({
    message: 'Server is running',
    staticPath: staticPath,
    files: require('fs').readdirSync(staticPath)
  });
});

// 所有其他路由都返回 index.html
app.get('*', (req, res) => {
  console.log(`Serving request for: ${req.path}`);
  res.sendFile(path.join(staticPath, 'index.html'));
});

// 设置端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Static files are served from: ${staticPath}`);
}); 