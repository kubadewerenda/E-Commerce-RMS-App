import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { registerRequestLogging } from './middlewares/logging.middleware.js';
import { NotFoundHandler } from './middlewares/notFound.middleware.js';
import { ErrorHandler } from './middlewares/errorHandler.middleware.js';

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.registerMiddlewares();
        this.registerRoutes();
        this.registerErrorHandlers();
    }

    private registerMiddlewares() {
        // 1) logowanie i request-id NAJPIERW
        registerRequestLogging(this.app);

        // 2) reszta bezpieczeństwa
        this.app.use(helmet());
        this.app.use(cors({ origin: true, credentials: true }));
        this.app.use(express.json());
    }

    private registerRoutes() {
        // minimalny test endpoint
        this.app.get('/api/health', (_req, res) => {
        res.json({ ok: true, ts: new Date().toISOString() });
        });

        // Zawsze na końcu 404:
        this.app.use(NotFoundHandler.handle);
    }

    private registerErrorHandlers() {
    // ZAWSZE ostatni
        this.app.use(ErrorHandler.handle);
    }

    /** Eksponujemy instancję Express do nasłuchu w server.ts */
    public get instance() {
        return this.app;
    }
}
