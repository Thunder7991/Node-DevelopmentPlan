exports.list = async (req,res) => {
    console.log(req.method);
    res.send("/video-list")
}