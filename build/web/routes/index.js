"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (req, res, next) => {
  res.send(`
<html>
<head>
    <meta charset="utf-8" class="next-head">
    <title class="next-head">WinterIsComing v2.1 Control panel</title>
    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no">
</head>
<body>
    <div id="root"></div>
    
    <script src="dist/main.bundle.js"></script>
</body>
</html>`);
};

exports.default = _default;