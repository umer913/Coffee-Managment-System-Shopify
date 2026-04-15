const { createApp } = require('./app');

const PORT = Number(process.env.PORT) || 4000;

createApp().listen(PORT, () => {
  console.log(`Coffee Management backend listening on port ${PORT}`);
});
