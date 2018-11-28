<html>

<head>
  <title>图片上传</title>
</head>

<body>
  <form action="/submit" method="POST" enctype="multipart/form-data">
    图片名字：<input type="text" name="picName" />
    选择图片：<input type="file" name="picData" />
    <br />
    <input type="submit" />
  </form>
</body>

</html>