module.exports = {
  apps: [
    {
      name: 'DSA_webapp',
      script: 'npm',
      args: 'run dev',
      interpreter: 'none',
      cwd: './',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
