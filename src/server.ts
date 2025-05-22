
import app from './app';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
