
export default (req, res, next) => {
  res.send(`
<html>
<head></head>
<body>
    <div id="root"></div>
    
    <script src="dist/main.bundle.js"></script>
</body>
</html>`)
}
