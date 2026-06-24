import express from 'express';
import { getServerStatus } from '../controllers/rootController.js';

const router = express.Router();

router.get('/', getServerStatus);

export default router;
