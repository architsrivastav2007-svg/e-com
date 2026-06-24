const getServerStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server Running',
  });
};

export { getServerStatus };
