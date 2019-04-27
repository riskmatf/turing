import {Router} from 'express';

const router = Router();

router.get('/example', (req, res) =>
{
    res.send('Hello world');
});

export default router;