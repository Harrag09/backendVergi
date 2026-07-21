function attachIO(io) {
    return (req, res, next) => {
        req.io = io;
        next();
    }
}
module.exports = { attachIO };