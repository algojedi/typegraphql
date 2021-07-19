import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'

// export interface MyContext {
//     req: Request
// }
export interface MyContext {
    req: Request & {
        session: Session & Partial<SessionData> & { userId?: number }
    }
    res: Response
}
