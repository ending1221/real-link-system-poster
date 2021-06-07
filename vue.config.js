module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/real-link-system-poster/' // test20200915 為 repo 名稱
      : '/'
  }