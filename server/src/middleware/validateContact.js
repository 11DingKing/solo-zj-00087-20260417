const validateContact = (req, res, next) => {
  const { name, phone, email } = req.body;
  const errors = [];

  if (!name) {
    errors.push('姓名为必填项');
  } else if (name.length > 20) {
    errors.push('姓名不能超过20个字符');
  }

  if (!phone) {
    errors.push('电话为必填项');
  } else if (!/^1[3-9]\d{9}$/.test(phone)) {
    errors.push('请输入正确的国内手机号格式');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('请输入正确的邮箱格式');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: '参数校验失败',
      errors: errors
    });
  }

  next();
};

module.exports = validateContact;
