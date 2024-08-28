
const app=require("./app")


app.get("/", (req, res) => {
  res.send("yes");
});
app.listen(9500, () => {
  console.log("server Started");
});
