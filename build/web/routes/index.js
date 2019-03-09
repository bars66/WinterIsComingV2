"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (req, res, next) => {
  res.send(`
<html>
<head></head>
<body>
    <div id="root"></div>
    
    <script src="dist/main.bundle.js"></script>
</body>
</html>`);
};

exports.default = _default;