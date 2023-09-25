const express = require('express');

const PORT = 5001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb", extended: true }));

app.post('/scraper-webhook', (req, res) => {
    console.log('New request received!', req.body);

    return res.json({ message: 'Hello World!' });
});

app.listen(PORT, () => {
    console.log(`Application started on URL http://localhost:${PORT} 🎉`);
});